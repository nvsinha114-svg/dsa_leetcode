/*
LeetCode #844
Problem: Backspace String Compare
Difficulty: Easy
URL: https://leetcode.com/problems/backspace-string-compare/
Time Complexity: O(n)
Space Complexity: O(1)
*/

class Solution {
    public boolean backspaceCompare(String s, String t) {
        Stack<Character> s1 = new Stack<>();
        Stack<Character> s2 = new Stack<>();
        for(int i =0;i<s.length();i++){
            char ch =s.charAt(i);
            if(ch=='#'){
                if(!s1.isEmpty()){
              s1.pop();
            }
        }
            else{
                s1.push(ch);
            }
        }
         for(int i =0;i<t.length();i++){
            char ch1 =t.charAt(i);
            if(ch1=='#'){
                if(!s2.isEmpty()){
                s2.pop();
            }
        }
            else{
                s2.push(ch1);
            }
        }
        if(s1.equals(s2)){
            return true;
        }
        return false;
    }
}
