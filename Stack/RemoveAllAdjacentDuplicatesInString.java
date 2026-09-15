/*
LeetCode #1047
Problem: Remove All Adjacent Duplicates In String
Difficulty: Easy
URL: https://leetcode.com/problems/remove-all-adjacent-duplicates-in-string/
Time Complexity: O(n)
Space Complexity: O(1)
*/

class Solution {
    public String removeDuplicates(String s) {
        Stack<Character> s1 =new Stack<>();
        for(int i =0;i<s.length();i++){
            char ch = s.charAt(i);
            if(!s1.isEmpty() && s1.peek()==ch){
                s1.pop();
            }
            else{
                s1.push(ch);
            }
        } 
        StringBuilder result = new StringBuilder();
        for (char c : s1) {
            result.append(c);
        }
        return result.toString();
    }
}
