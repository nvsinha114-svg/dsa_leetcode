/*
LeetCode #78
Problem: Subsets
Difficulty: Medium
URL: https://leetcode.com/problems/subsets/
Time Complexity: O(n)
Space Complexity: O(1)
*/

}
            return;

        //lo
        current.add(nums[index]);
        backtrack(nums,index+1,current,ans);

        //backtrack
        current.remove(current.size()-1);

        //mat lo
        backtrack(nums,index+1,current,ans);

    }
}
