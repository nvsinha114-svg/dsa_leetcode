/*
LeetCode #438
Problem: Find All Anagrams in a String
Difficulty: Medium
URL: https://leetcode.com/problems/find-all-anagrams-in-a-string/
Time Complexity: O(n)
Space Complexity: O(1)
*/

//Sliding window

        for(int right=k ;right<s.length();right++){

        if(Arrays.equals(freqp,freqs)) ans.add(0);

        }
            freqs[s.charAt(i)- 'a']++;
        for(int i=0;i<k;i++){

        }

            freqs[s.charAt(right)-'a']++;

            freqs[s.charAt(right-k)-'a']--;

            if(Arrays.equals(freqp,freqs)) ans.add(right-k+1);
        }

        return ans;
