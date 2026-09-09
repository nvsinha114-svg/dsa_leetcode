/*
LeetCode #39
Problem: Combination Sum
Difficulty: Medium
URL: https://leetcode.com/problems/combination-sum/
Time Complexity: O(n)
Space Complexity: O(1)
*/

}

        if(target < 0 || index == candidates.length) return;

        //LO
        current.add(candidates[index]);
        backtrack(candidates,index,target-candidates[index],current,ans);

        //BACKTRACK
        current.remove(current.size()-1);

        //MAT LO
        backtrack(candidates,index+1,target,current,ans);
    }
}
