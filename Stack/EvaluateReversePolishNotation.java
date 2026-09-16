/*
LeetCode #150
Problem: Evaluate Reverse Polish Notation
Difficulty: Medium
URL: https://leetcode.com/problems/evaluate-reverse-polish-notation/
Time Complexity: O(n)
Space Complexity: O(1)
*/

class Solution {
    public int evalRPN(String[] tokens) {

        Stack<Integer> st = new Stack<>();

        for( String op: tokens){

            if(op.equals("+")){

                int a =st.pop();
                int b = st.pop();

                st.push(a+b);
            }

             else if(op.equals("-")){

                int c =st.pop();
                int d = st.pop();

                st.push(d-c);
             }

            else if(op.equals("*")){

                int e =st.pop();
                int f = st.pop();

                st.push(e*f);
              }

            else if(op.equals("/")){

                int g =st.pop();
                int h = st.pop();

                st.push(h/g);
               }

            else st.push(Integer.parseInt(op));
        }

        int ans = st.pop();
        
        return ans;
        
    }
}
