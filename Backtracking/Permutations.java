/*
LeetCode #46
Problem: Permutations
Difficulty: Medium
URL: https://leetcode.com/problems/permutations/
Time Complexity: O(n)
Space Complexity: O(1)
*/

class Solution {
    public List<List<Integer>> permute(int[] nums) {

        List<List<Integer>> ans = new ArrayList<>();
        boolean[] used = new boolean[nums.length];

        backtrack(nums,used,new ArrayList<>(),ans);

        return ans;
        
    }

    public void backtrack(int[] nums , boolean[] used,
                          List<Integer> current,
                          List<List<Integer>> ans){

            if(current.size() == nums.length){
                ans.add(new ArrayList<>(current));
                return;
            }

            for(int i=0;i<nums.length;i++){

                if(used[i]) continue;

                //LO
                used[i] = true;
                current.add(nums[i]);
                backtrack(nums,used,current,ans);

                //MAT LO 
                current.remove(current.size()-1);
                used[i] = false;
            }
                        
      }
}
