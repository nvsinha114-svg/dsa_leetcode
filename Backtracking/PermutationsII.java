/*
LeetCode #47
Problem: Permutations II
Difficulty: Medium
URL: https://leetcode.com/problems/permutations-ii/
Time Complexity: O(n)
Space Complexity: O(1)
*/

for(int i=0;i<nums.length;i++){

                if(i>0 && nums[i]==nums[i-1] && !used[i-1]) continue;

                //LO
                used[i] = true;
                current.add(nums[i]);
                backtrack(nums,used,current,ans);


                //MAT LO
                current.remove(current.size()-1);
                used[i] = false;
            }

    }
}
