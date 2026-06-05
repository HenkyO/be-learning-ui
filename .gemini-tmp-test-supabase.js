import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testTables() {
  const tables = ['profiles', 'modules', 'questions', 'progress']
  let allGood = true
  
  for (const table of tables) {
    console.log(`Testing table: ${table}...`)
    const { data, error } = await supabase.from(table).select('*').limit(1)
    if (error) {
      console.error(`❌ Error in table ${table}:`, error.message)
      allGood = false
    } else {
      console.log(`✅ Table ${table} verified (rows returned: ${data.length})`)
    }
  }
  
  if (allGood) {
    console.log('\n✅ All Supabase tables successfully verified!')
  } else {
    console.log('\n❌ Some tables failed verification.')
  }
}

testTables()