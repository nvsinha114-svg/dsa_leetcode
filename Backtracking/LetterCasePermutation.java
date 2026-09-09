/*
LeetCode #784
Problem: Letter Case Permutation
Difficulty: Medium
URL: https://leetcode.com/problems/letter-case-permutation/
Time Complexity: O(n)
Space Complexity: O(1)
*/

//digit
        if(Character.isDigit(chars[index])){
        return ans;
        
    }

    public void backtrack(char[] chars, int index , List<String> ans){

        if(index == chars.length){
            ans.add(new String(chars));
            return;
        }
        backtrack(chars,index+1,ans);
        }

        //small letter
        chars[index] = Character.toLowerCase(chars[index]);
        backtrack(chars,index+1,ans);
        return;
