/*
LeetCode #77
Problem: Combinations
Difficulty: Medium
URL: https://leetcode.com/problems/combinations/
Time Complexity: O(n)
Space Complexity: O(1)
*/

class Solution {
    public List<List<Integer>> combine(int n, int k) {

        List<List<Integer>> ans  = new ArrayList<>();

        backtrack(n,k,1,new ArrayList<>(),ans);

        return ans;
        
    }

    public void backtrack(int n, int k , int start,
                          List<Integer> current,
                          List<List<Integer>> ans){

        if(current.size() == k){
            ans.add(new ArrayList<>(current));
            return;
        }

        for(int i=start;i<=n;i++){

            //LO
            current.add(i);
            backtrack(n,k,i+1,current,ans);

            //MAT LO
            current.remove(current.size()-1);
        }
        

    }
}
