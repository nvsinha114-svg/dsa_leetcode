/*
LeetCode #49
Problem: Group Anagrams
Difficulty: Medium
URL: https://leetcode.com/problems/group-anagrams/
Time Complexity: O(n)
Space Complexity: O(1)
*/

for(char ch : word.toCharArray()){

              }
                  freq[ch -'a']++;

            String key = Arrays.toString(freq);

            map.putIfAbsent(key,new ArrayList<>());

            map.get(key).add(word);
        }
        
    }

        return new ArrayList<>(map.values());
}
