const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://bzmlrqvpvnpfjilcvgqy.supabase.co';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ6bWxycXZwdm5wZmppbGN2Z3F5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTI5NzAxNSwiZXhwIjoyMTAwODczMDE1fQ.SOqKznTe3mg_kEnXccyvutAsTtBbQFWl1rkYeUTQ91g';

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
const DATA_DIR = path.join(__dirname, '..', 'backend', 'migrations', 'data');

async function importJSON(filename, table, batchSize = 50) {
  const filepath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filepath)) {
    console.log(`  SKIP: ${filename} not found`);
    return 0;
  }
  const data = JSON.parse(fs.readFileSync(filepath, 'utf-8'));
  console.log(`  Importing ${data.length} rows into ${table}...`);

  let imported = 0;
  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize);
    const { error } = await supabase.from(table).insert(batch);
    if (!error) {
      imported += batch.length;
    } else {
      for (const row of batch) {
        const { error: rowErr } = await supabase.from(table).insert(row);
        if (!rowErr) {
          imported++;
        } else {
          const idField = table === 'sources' ? 'id' : 'entity_id';
          console.error(`    FAIL: ${row[idField]}: ${rowErr.message}`);
        }
      }
    }
    process.stdout.write(`\r    ${imported}/${data.length}`);
  }
  console.log(`\n  Done: ${imported}/${data.length} imported`);
  return imported;
}

async function main() {
  const tables = [
    { file: 'sources.json', table: 'sources' },
    { file: 'entities.json', table: 'entities' },
    { file: 'food_items.json', table: 'food_items' },
    { file: 'clinical_rules.json', table: 'clinical_rules' },
    { file: 'citations.json', table: 'citations' },
  ];

  for (const { table } of tables) {
    const { error } = await supabase.from(table).select('*', { count: 'exact', head: true });
    if (error) {
      console.log(`❌ Table ${table} not found. Run SQL migration first.`);
      return;
    }
  }
  console.log('✅ All tables exist\n');

  for (const { file, table } of tables) {
    console.log(`[${table}]`);
    await importJSON(file, table);
  }

  console.log('\n=== Verification ===');
  for (const { table } of tables) {
    const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true });
    if (!error) {
      console.log(`  ${table}: ${count} rows`);
    } else {
      console.log(`  ${table}: ERROR - ${error.message}`);
    }
  }

  console.log('\nDone.');
}

main().catch(console.error);
