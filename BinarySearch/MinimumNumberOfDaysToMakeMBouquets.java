/*
LeetCode #1482
Problem: Minimum Number of Days to Make m Bouquets
Difficulty: Medium
URL: https://leetcode.com/problems/minimum-number-of-days-to-make-m-bouquets/
Time Complexity: O(n)
Space Complexity: O(1)
*/

if(bloom <= day){

                flowers++;

                if(flowers==k){

                    bouquets++;
                    flowers = 0;
                }

                if(bouquets == m) return true;
              }
              else flowers = 0;

        }

        return false;
    }
}
