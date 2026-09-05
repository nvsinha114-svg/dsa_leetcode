/*
LeetCode #875
Problem: Koko Eating Bananas
Difficulty: Medium
URL: https://leetcode.com/problems/koko-eating-bananas/
Time Complexity: O(n)
Space Complexity: O(1)
*/

class Solution {
    public int minEatingSpeed(int[] piles, int h) {

        int low = 1;
        int high = 0;

        for(int x : piles) {
            high = Math.max(high, x);
        }

        while(low <= high) {

            int mid = low + (high - low) / 2;
            long hours = 0;

            for(int x : piles) {
                hours += (x + mid - 1) / mid;
            }

            if(hours <= h) {
                high = mid - 1;
            } else {
                low = mid + 1;
            }
        }

        return low;
    }
}
