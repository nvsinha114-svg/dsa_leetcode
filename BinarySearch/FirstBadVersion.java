/*
LeetCode #278
Problem: First Bad Version
Difficulty: Easy
URL: https://leetcode.com/problems/first-bad-version/
Time Complexity: O(n)
Space Complexity: O(1)
*/

/* The isBadVersion API is defined in the parent class VersionControl.
      boolean isBadVersion(int version); */

public class Solution extends VersionControl {
    public int firstBadVersion(int n) {
        
        int low =0;
        int high = n;

        while(low<high){

            int mid = low + (high-low)/2;

            if(isBadVersion(mid)) high = mid;

            else low =mid+1;
        }
        
           return low;

    }
}
