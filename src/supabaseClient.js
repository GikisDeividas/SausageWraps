import { createClient } from '@supabase/supabase-js'

// These will be your Supabase project credentials
// You'll get these from your Supabase dashboard
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'YOUR_SUPABASE_URL'
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database functions for cyclists
export const cyclistsAPI = {
  // Get all cyclists
  async getAll() {
    const { data, error } = await supabase
      .from('cyclists')
      .select('*')
      .order('votes', { ascending: false })
    
    if (error) {
      console.error('Error fetching cyclists:', error)
      return []
    }
    return data || []
  },

  // Add a new cyclist
  async add(cyclist) {
    const { data, error } = await supabase
      .from('cyclists')
      .insert([cyclist])
      .select()
    
    if (error) {
      console.error('Error adding cyclist:', error)
      return null
    }
    return data?.[0] || null
  },

  // Update cyclist votes
  async updateVotes(id, newVotes) {
    const { data, error } = await supabase
      .from('cyclists')
      .update({ votes: newVotes })
      .eq('id', id)
      .select()
    
    if (error) {
      console.error('Error updating votes:', error)
      return null
    }
    return data?.[0] || null
  },

  // Clear all cyclists (admin function)
  async clearAll() {
    const { error } = await supabase
      .from('cyclists')
      .delete()
      .neq('id', 0) // Delete all records
    
    if (error) {
      console.error('Error clearing cyclists:', error)
      return false
    }
    return true
  },

  // Subscribe to real-time changes
  subscribeToChanges(callback) {
    return supabase
      .channel('cyclists_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'cyclists' }, 
        callback
      )
      .subscribe()
  }
}

// User votes API (using localStorage for simplicity)
export const userVotesAPI = {
  get() {
    try {
      const saved = localStorage.getItem('sausageWraps_userVotes')
      return saved ? JSON.parse(saved) : { count: 0, votedImages: [] }
    } catch (error) {
      console.error('Error getting user votes:', error)
      return { count: 0, votedImages: [] }
    }
  },

  save(votes) {
    try {
      localStorage.setItem('sausageWraps_userVotes', JSON.stringify(votes))
    } catch (error) {
      console.error('Error saving user votes:', error)
    }
  },

  clear() {
    localStorage.removeItem('sausageWraps_userVotes')
  }
} 