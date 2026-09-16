/*
LeetCode #739
Problem: Daily Temperatures
Difficulty: Medium
URL: https://leetcode.com/problems/daily-temperatures/
Time Complexity: O(n)
Space Complexity: O(1)
*/

class Solution {
    public int[] dailyTemperatures(int[] temperatures) {

        int n= temperatures.length;

        Stack<Integer> st = new Stack<>();

        int[] ans = new int[n];

        for(int i =0;i<n;i++){

            while(!st.isEmpty() && temperatures[i]>temperatures[st.peek()]){

                ans[st.peek()] = i-st.peek();
                st.pop();

            }
            st.push(i);
        }

        return ans;
        
    }
}
