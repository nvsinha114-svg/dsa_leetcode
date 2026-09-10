/*
LeetCode #17
Problem: Letter Combinations of a Phone Number
Difficulty: Medium
URL: https://leetcode.com/problems/letter-combinations-of-a-phone-number/
Time Complexity: O(n)
Space Complexity: O(1)
*/

String letters = map[digit];

            for(int i=0;i<letters.length();i++){

            int digit = digits.charAt(index) -'0';

            }
                return;
                ans.add(current.toString());

            if(index == digits.length()){
        

                          List<String> ans, String[] map){
               //LO
               current.append(letters.charAt(i));
               backtrack(digits,index+1,current,ans,map);

               //MAT LO
               current.deleteCharAt(current.length()-1);
