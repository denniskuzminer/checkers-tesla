import java.util.*;
import java.io.*;

public class Solution {

    static BufferedWriter output;
    static int k;
    static String[] tiles;
    static String t;

    public static void main(String[] args) throws Exception {
        // BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        File file = new File("C:/Users/denni/Comp Sci/CSCIUA310/PA6/tiles-sample-IO/tiles-sample-IO/mysample.txt");
        BufferedReader br = new BufferedReader(new FileReader(file));
        String st;
        t = br.readLine();
        k = Integer.parseInt(br.readLine());
        tiles = new String[k];
        for (int i = 0; i < k && ((st = br.readLine()) != null); i++) {
            tiles[i] = st;
        }
        opt(t, tiles);
        br.close();
    }

    public static void opt(String t, String[] tiles) {
        int[][] T = new int[tiles.length + 1][t.length() + 1];
        for (int i = 0; i < tiles.length + 1; i++)
            T[i][0] = 0;
        for (int i = 1; i < t.length() + 1; i++)
            T[0][i] = -1;
        for (int i = 1; i < t.length() + 1; i++) {
            String currSubString = t.substring(0, i);
            for (int j = 1; j < tiles.length + 1; j++) {
                if (currSubString.endsWith(tiles[j - 1])) {
                    if (T[j - 1][i - tiles[j - 1].length()] != -1) {
                        T[j][i] = 1 + T[j - 1][i - tiles[j - 1].length()];
                        if (T[j - 1][i] != -1 && T[j - 1][i] < T[j][i]) {
                            T[j][i] = T[j - 1][i];
                        }
                    } else {
                        T[j][i] = T[j - 1][i];
                    }
                } else {
                    T[j][i] = T[j - 1][i];
                }
            }
        }

        for (int i = 0; i < T.length; i++) {
            if (i == 0)
                System.out.println(i + "\t" + " " + "\t" + Arrays.toString(T[i]));
            else
                System.out.println(i + "\t" + tiles[i - 1] + "\t" + Arrays.toString(T[i]));
        }

        int solution = T[tiles.length][t.length()];
        int[] sol;
        if (solution != -1) {
            sol = new int[solution];
            for (int i = tiles.length, j = t.length(); i != 0 || solution != 0; i--) {
                if (T[i][j] == solution && T[i - 1][j] != solution) {
                    sol[--solution] = i;
                    j -= tiles[i - 1].length();
                }
            }
            System.out.println(T[tiles.length][t.length()] + " "
                    + Arrays.toString(sol).replace("[", "").replace(",", "").replace("]", ""));
        } else {
            System.out.println(0);
        }
    }
}