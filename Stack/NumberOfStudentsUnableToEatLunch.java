/*
LeetCode #1700
Problem: Number of Students Unable to Eat Lunch
Difficulty: Easy
URL: https://leetcode.com/problems/number-of-students-unable-to-eat-lunch/
Time Complexity: O(n)
Space Complexity: O(1)
*/

}

            else {

                q.poll();
                st.pop();
                cnt=0;
                
            }
        }

        return q.size();
                q.offer(q.poll());
        
                cnt++;

            if(q.peek()!=st.peek()){

        while(!q.isEmpty()){

                if(cnt==q.size()) break;
