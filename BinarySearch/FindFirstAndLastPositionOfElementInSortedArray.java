/*
LeetCode #34
Problem: Find First and Last Position of Element in Sorted Array
Difficulty: Medium
URL: https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/
Time Complexity: O(n)
Space Complexity: O(1)
*/

if(nums[mid]==target) {

                ans[1] = mid;
                low = mid+1;
            }

            else if(nums[mid]>target) high = mid-1;

            else low = mid+1;
        }

        return ans;
        
    }
}
