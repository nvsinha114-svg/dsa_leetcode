/*
LeetCode #90
Problem: Subsets II
Difficulty: Medium
URL: https://leetcode.com/problems/subsets-ii/
Time Complexity: O(n)
Space Complexity: O(1)
*/

current.remove(current.size()-1);

        //mat lo

        int next = index+1;
        
        while(next<nums.length && nums[index]==nums.length){
            next++;
        }

        backtrack(nums,index+1,current,ans);

    }
}
        //backtrack
