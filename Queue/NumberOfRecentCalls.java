/*
LeetCode #933
Problem: Number of Recent Calls
Difficulty: Easy
URL: https://leetcode.com/problems/number-of-recent-calls/
Time Complexity: O(n)
Space Complexity: O(1)
*/

class RecentCounter {

    Queue<Integer> q;

    public RecentCounter() {

        q = new LinkedList<>();
        
    }
    
    public int ping(int t) {

        q.offer(t);

        while(q.peek()<t-3000){

            q.remove();
        }

        return q.size();
        
    }
}

/**
 * Your RecentCounter object will be instantiated and called as such:
 * RecentCounter obj = new RecentCounter();
 * int param_1 = obj.ping(t);
 */
