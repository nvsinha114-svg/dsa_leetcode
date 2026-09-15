/*
LeetCode #496
Problem: Next Greater Element I
Difficulty: Easy
URL: https://leetcode.com/problems/next-greater-element-i/
Time Complexity: O(n)
Space Complexity: O(1)
*/

class Solution {
    public int[] nextGreaterElement(int[] nums1, int[] nums2) {

        HashMap<Integer,Integer> map = new HashMap<>();
        Stack<Integer> st = new Stack<>();

        for(int j =nums2.length-1;j>=0;j--){

            while(!st.isEmpty() && st.peek()<=nums2[j]) {

                st.pop();
            }

            if(st.isEmpty()) map.put(nums2[j],-1);

            else map.put(nums2[j],st.peek());

            st.push(nums2[j]);
        }

        int[] ans =new int[nums1.length];

        for(int i=0;i<nums1.length;i++){

            ans[i] = map.get(nums1[i]);
        }

        return ans;
        
    }
}
