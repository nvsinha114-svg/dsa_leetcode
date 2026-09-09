/*
LeetCode #784
Problem: Letter Case Permutation
Difficulty: Medium
URL: https://leetcode.com/problems/letter-case-permutation/
Time Complexity: O(n)
Space Complexity: O(1)
*/

public void backtrack(char[] chars, int index , List<String> ans){

        if(index == chars.length){
            ans.add(new String(chars));
        }
            return;

        //digit
        if(Character.isDigit(chars[index])){

    }
        
    public List<String> letterCasePermutation(String s) {
class Solution {

        List<String> ans = new ArrayList<>();

        backtrack(s.toCharArray(),0,ans);
        return ans;
