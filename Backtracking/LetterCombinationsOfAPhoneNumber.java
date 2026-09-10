/*
LeetCode #17
Problem: Letter Combinations of a Phone Number
Difficulty: Medium
URL: https://leetcode.com/problems/letter-combinations-of-a-phone-number/
Time Complexity: O(n)
Space Complexity: O(1)
*/

class Solution {
    public List<String> letterCombinations(String digits) {

        List<String> ans = new ArrayList<>();
        if(digits.length() == 0) { return ans; }

        String[] map = {"","","abc","def","ghi","jkl","mno","pqrs","tuv","wxyz"};

        backtrack(digits,0,new StringBuilder(),ans,map);

        return ans;
        
    }

    public void backtrack(String digits, int index, StringBuilder current,
                          List<String> ans, String[] map){

        
            if(index == digits.length()){

                ans.add(current.toString());
                return;
            }

            int digit = digits.charAt(index) -'0';

            String letters = map[digit];

            for(int i=0;i<letters.length();i++){

               //LO
               current.append(letters.charAt(i));
               backtrack(digits,index+1,current,ans,map);

               //MAT LO
               current.deleteCharAt(current.length()-1);
            }

    }
}
