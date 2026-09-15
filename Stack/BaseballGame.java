/*
LeetCode #682
Problem: Baseball Game
Difficulty: Easy
URL: https://leetcode.com/problems/baseball-game/
Time Complexity: O(n)
Space Complexity: O(1)
*/

class Solution {
    public int calPoints(String[] operations) {

        Stack<Integer> st = new Stack<>();

        for(String op : operations){

            if(op.equals("+")){

                int a =st.pop();
                int b =st.peek();
                
                st.push(a);
                st.push(a+b);
            }
           
           else if(op.equals("D")){
            
            st.push(2*st.peek());

           }

           else if(op.equals("C")){
          
              st.pop();
           }

           else st.push(Integer.parseInt(op));
            
        }

        int sum =0;

        while(!st.isEmpty()){

            sum+=st.pop();
        }

        return sum;
        
    }
}
