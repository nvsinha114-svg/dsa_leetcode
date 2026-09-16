/*
LeetCode #1700
Problem: Number of Students Unable to Eat Lunch
Difficulty: Easy
URL: https://leetcode.com/problems/number-of-students-unable-to-eat-lunch/
Time Complexity: O(n)
Space Complexity: O(1)
*/

class Solution {
    public int countStudents(int[] students, int[] sandwiches) {

        Queue<Integer> q = new LinkedList<>();
        Stack<Integer> st = new Stack<>();

        for(int x : students){

            q.offer(x);
        }

        for(int i =sandwiches.length-1;i>=0;i--){

            st.push(sandwiches[i]);
        }

        int cnt= 0;

        while(!q.isEmpty()){

            if(q.peek()!=st.peek()){

                cnt++;
                q.offer(q.poll());
                if(cnt==q.size()) break;
            }

            else {

                q.poll();
                st.pop();
                cnt=0;
                
            }
        }

        return q.size();
        
    }
}
