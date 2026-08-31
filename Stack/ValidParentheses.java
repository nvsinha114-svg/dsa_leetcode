/*
LeetCode #20
Problem: Valid Parentheses
Difficulty: Easy
URL: https://leetcode.com/problems/valid-parentheses/
Time Complexity: O(n)
Space Complexity: O(1)
*/

class Solution {
    public boolean isValid(String s) {
         Stack<Character> stack = new Stack<>();
          for(int i =0;i<s.length();i++){
             char ch = s.charAt(i);
            if(s.charAt(i)=='(' || s.charAt(i)=='{' || s.charAt(i)=='['){
                stack.push(ch);
            }
            else{
                if(stack.isEmpty()){
                return false;
              }
            char top = stack.pop();
            if((s.charAt(i)==')' && top!='(')||(s.charAt(i)=='}' && top!='{')||
            (s.charAt(i)==']' && top!='[')){
                return false;
            }
        }
     }
            return stack.isEmpty();
          }
      }
