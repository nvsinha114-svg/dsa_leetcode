class Solution {
    public List<String> letterCasePermutation(String s) {

        List<String> ans = new ArrayList<>();

        backtrack(s.toCharArray(),0,ans);
        return ans;
        
    }

    public void backtrack(char[] chars, int index , List<String> ans){

        if(index == chars.length){
            ans.add(new String(chars));
            return;
        }

        //digit
        if(Character.isDigit(chars[index])){
        backtrack(chars,index+1,ans);
        return;
        }

        //small letter
        chars[index] = Character.toLowerCase(chars[index]);
        backtrack(chars,index+1,ans);

        //capital letter
        chars[index] = Character.toUpperCase(chars[index]);
        backtrack(chars,index+1,ans);
    }
}
