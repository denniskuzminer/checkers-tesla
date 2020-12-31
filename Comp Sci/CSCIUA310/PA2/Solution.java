
import java.io.*;
import java.util.*;

class Node {
    String guide;
    int value;
}

class InternalNode extends Node {
    Node child0, child1, child2;
}

class LeafNode extends Node {
}

class TwoThreeTree {
    Node root;
    int height;

    TwoThreeTree() {
        root = null;
        height = -1;
    }
}

class WorkSpace {
    // this class is used to hold return values for the recursive doInsert
    // routine (see below)

    Node newNode;
    int offset;
    boolean guideChanged;
    Node[] scratch;
}

class Solution {

    static BufferedWriter output;

    public static void main(String[] args) throws Exception {

        File file = new File("C:/Users/denni/Comp Sci/CSCIUA310/PA2/2-3-tree-range-update-sample-io/test9.in");

        BufferedReader br = new BufferedReader(new FileReader(file));

        // output = new BufferedWriter(new OutputStreamWriter(System.out, "ASCII"),
        // 4096);

        File file2 = new File("C:/Users/denni/Comp Sci/CSCIUA310/PA2/2-3-tree-range-update-sample-io/mytest9.out");
        if (!file2.exists()) {
            file2.createNewFile();
        }
        FileWriter fw = new FileWriter(file2);
        output = new BufferedWriter(fw);
        int n;
        char queryType;
        String st;
        String query;
        String key;
        int value;
        if (file.length() != 0) {
            n = Integer.parseInt(br.readLine());
            TwoThreeTree tree = new TwoThreeTree();
            if (n != 0) {
                for (int i = 0; i < n && ((st = br.readLine()) != null); i++) {
                    queryType = st.charAt(0);
                    query = st.substring(2);
                    switch (queryType) {
                        case '1':
                            key = query.substring(0, query.indexOf(" "));
                            value = Integer.parseInt(query.substring(query.indexOf(" ") + 1));
                            insert(key, value, tree);
                            break;
                        case '2':
                            String from = query.substring(0, query.indexOf(" "));
                            String tempQuery = query.substring(query.indexOf(" ") + 1);
                            String to = tempQuery.substring(0, tempQuery.indexOf(" "));
                            tempQuery = tempQuery.substring(tempQuery.indexOf(" ") + 1);
                            value = Integer.parseInt(tempQuery);
                            addRange(from, to, tree, value);
                            break;
                        case '3':
                            key = query;
                            output.write(searchFee(key, tree) + "\n");
                            break;
                        default:

                            break;
                    }
                }
            }
            output.flush();
            br.close();
        }
    }

    static void addRange(String x, String y, TwoThreeTree tree, int delta) throws Exception {
        // This checks to see if y is greater than x
        if (y.compareTo(x) <= 0) {
            String temp = x;
            x = y;
            y = temp;
        }

        // Step 1
        Node[] pathx = searchPath(x, tree);
        String[] guidePathX = new String[pathx.length];
        for (int i = 0; i < pathx.length; i++) {
            guidePathX[i] = pathx[i].guide;
        }
        // output.write("Path from " + tree.root.guide + " to " + x + ": " +
        // Arrays.toString(guidePathX) + "\n");

        // Step 2
        Node[] pathy = searchPath(y, tree);
        String[] guidePathY = new String[pathy.length];
        for (int i = 0; i < pathy.length; i++) {
            if (pathy[i] != null) {
                guidePathY[i] = pathy[i].guide;
            }
        }
        // output.write("Path from " + tree.root.guide + " to " + y + ": " +
        // Arrays.toString(guidePathY) + "\n");

        // Step 3
        int divergenceLevel = divergenceLevel(pathx, pathy);
        Node divergenceNode = divergenceNode(pathx, pathy);
        if (divergenceNode != null) {
            // output.write("The two nodes diverge at node: " + divergenceNode.guide + " at
            // level " + divergenceLevel + "\n");
        }

        // Step 4 is implemented already

        // Edge case when the height is 0
        if (tree.height == 0 && isInRange(x, y, tree.root.guide)) {
            tree.root.value += delta;
        } else {
            if (Arrays.equals(pathx, pathy)) {
                // Edge case when the two paths are the same
                if (!isInRange(x, y, pathx[pathx.length - 1].guide)) {
                    return;
                }
                pathx[pathx.length - 1].value += delta;
            } else {
                // Case where the height is 1
                // This is added just to avoid any errors resulting from indices on a tree that
                // would be too small
                if (tree.height == 1) {
                    if (isInRange(x, y, ((InternalNode) tree.root).child0.guide)) {
                        ((InternalNode) tree.root).child0.value += delta;
                    }
                    if (isInRange(x, y, ((InternalNode) tree.root).child1.guide)) {
                        ((InternalNode) tree.root).child1.value += delta;
                    }
                    if (((InternalNode) tree.root).child2 != null
                            && isInRange(x, y, ((InternalNode) tree.root).child2.guide)) {
                        ((InternalNode) tree.root).child2.value += delta;
                    }

                } else {
                    // Step 5
                    for (int i = pathx.length - 1; i > divergenceLevel; i--) {
                        // If is leaf
                        if (i == pathx.length - 1 && tree.height > 1) {
                            InternalNode p2 = (InternalNode) pathx[i - 1];
                            // If the first child is the lower bound
                            if (p2.child0.guide.equals(guidePathX[i])) {
                                if (i - 1 != divergenceLevel) {
                                    if (isInRange(x, y, guidePathX[i])) {
                                        pathx[i].value += delta;
                                    }
                                    if (isInRange(x, y, p2.child1.guide)) {
                                        ((InternalNode) pathx[i - 1]).child1.value += delta;
                                    }
                                    if (p2.child2 != null) {
                                        if (isInRange(x, y, p2.child2.guide)) {
                                            ((InternalNode) pathx[i - 1]).child2.value += delta;
                                        }
                                    }
                                } else {
                                    if (isInRange(x, y, guidePathX[i])) {
                                        pathx[i].value += delta;
                                    }
                                }
                            } else {
                                // If the second child is the lower bound
                                if (p2.child1.guide.equals(guidePathX[i])) {
                                    if ((i - 1 != divergenceLevel)) {
                                        if (isInRange(x, y, guidePathX[i])) {
                                            pathx[i].value += delta;
                                        }
                                        if (p2.child2 != null) {
                                            if (isInRange(x, y, p2.child2.guide)) {
                                                ((InternalNode) pathx[i - 1]).child2.value += delta;
                                            }
                                        }
                                    } else {
                                        if (isInRange(x, y, guidePathX[i])) {
                                            pathx[i].value += delta;
                                        }
                                    }
                                } else {
                                    // If the third child is the lower bound
                                    if (p2.child2 != null) {
                                        if (isInRange(x, y, ((InternalNode) pathx[i - 1]).child2.guide)) {
                                            ((InternalNode) pathx[i - 1]).child2.value += delta;
                                        }
                                    }
                                }
                            }
                        } else {
                            // If is not leaf
                            if (!pathx[i + 1].getClass().getName().contains("LeafNode")) {
                                InternalNode p3 = (InternalNode) pathx[i];
                                if (p3.child0.guide.equals(guidePathX[i + 1]) && isInRange(x, y, guidePathX[i + 1])) {
                                    ((InternalNode) pathx[i]).child1.value += delta;
                                    // printAll(tree, p3.child1, pathx.length - i - 2);
                                    if (p3.child2 != null) {
                                        // printAll(tree, p3.child2, pathx.length - i - 2);
                                        ((InternalNode) pathx[i]).child2.value += delta;
                                    }
                                } else {
                                    if (p3.child1.guide.equals(guidePathX[i + 1])
                                            && isInRange(x, y, guidePathX[i + 1])) {
                                        if (p3.child2 != null) {
                                            // printAll(tree, p3.child2, pathx.length - i - 2);
                                            ((InternalNode) pathx[i]).child2.value += delta;
                                        }
                                    }
                                }
                            }
                        }
                    }

                    // Step 6
                    InternalNode p4 = (InternalNode) divergenceNode;
                    // If it does diverge
                    if (p4 != null) {
                        // If there is a third child and then validates the left and right nodes
                        if (p4.child2 != null && p4.child0.guide.equals(guidePathX[divergenceLevel + 1])
                                && p4.child2.guide.equals(guidePathY[divergenceLevel + 1])
                                && isInRange(x, y, ((InternalNode) divergenceNode).child1.guide)) {
                            ((InternalNode) divergenceNode).child1.value += delta;
                            // printAll(tree, p4.child1, (tree.height - 1) - divergenceLevel);
                        }
                    }

                    // Step 7
                    for (int i = divergenceLevel + 1; i < pathy.length; i++) {
                        // If is leaf
                        if (i == pathy.length - 1 && tree.height > 1) {
                            InternalNode p2 = (InternalNode) pathy[i - 1];
                            // If the first child is the upper bound
                            if (p2.child0.guide.equals(guidePathY[i])) {
                                if (isInRange(x, y, guidePathY[i])) {
                                    pathy[i].value += delta;
                                }
                            } else {
                                // If the second child is the upper bound
                                if (p2.child1.guide.equals(guidePathY[i])) {
                                    if ((i - 1 != divergenceLevel)) {
                                        if (isInRange(x, y, p2.child0.guide)) {
                                            ((InternalNode) pathy[i - 1]).child0.value += delta;
                                        }
                                        if (isInRange(x, y, guidePathY[i])) {
                                            pathy[i].value += delta;
                                        }
                                    } else {
                                        if (isInRange(x, y, guidePathY[i])) {
                                            pathy[i].value += delta;
                                        }
                                    }
                                } else {
                                    if (p2.child2 != null && (i - 1 != divergenceLevel)) {
                                        // If the third child is the upper bound
                                        if (isInRange(x, y, p2.child0.guide)) {
                                            ((InternalNode) pathy[i - 1]).child0.value += delta;
                                        }
                                        if (isInRange(x, y, p2.child1.guide)) {
                                            ((InternalNode) pathy[i - 1]).child1.value += delta;
                                        }
                                        if (isInRange(x, y, guidePathY[i])) {
                                            pathy[i].value += delta;
                                        }
                                    } else {
                                        if (isInRange(x, y, guidePathY[i])) {
                                            pathy[i].value += delta;
                                        }
                                    }
                                }
                            }
                        } else {
                            // Any case where is not a leaf
                            if (!pathy[i + 1].getClass().getName().contains("LeafNode")) {
                                InternalNode p3 = (InternalNode) pathy[i];
                                if (p3.child2 != null && p3.child2.guide.equals(guidePathY[i + 1])) {
                                    if (isInRange(x, y, ((InternalNode) pathy[i]).child0.guide)) {
                                        ((InternalNode) pathy[i]).child0.value += delta;
                                    }
                                    if (isInRange(x, y, ((InternalNode) pathy[i]).child1.guide)) {
                                        ((InternalNode) pathy[i]).child1.value += delta;
                                    }
                                    // printAll(tree, p3.child0, pathy.length - i - 2);
                                    // printAll(tree, p3.child1, pathy.length - i - 2);
                                } else {
                                    if (p3.child1.equals(pathy[i + 1])) {
                                        if (isInRange(x, y, ((InternalNode) pathy[i]).child0.guide)) {
                                            ((InternalNode) pathy[i]).child0.value += delta;
                                        }
                                        // printAll(tree, p3.child0, pathy.length - i - 2);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    static void printRange(String x, String y, TwoThreeTree tree) throws Exception {
        // This checks to see if y is greater than x
        if (y.compareTo(x) <= 0) {
            String temp = x;
            x = y;
            y = temp;
        }

        // Step 1
        Node[] pathx = searchPath(x, tree);
        String[] guidePathX = new String[pathx.length];
        for (int i = 0; i < pathx.length; i++) {
            guidePathX[i] = pathx[i].guide;
        }
        // output.write("Path from " + tree.root.guide + " to " + x + ": " +
        // Arrays.toString(guidePathX) + "\n");

        // Step 2
        Node[] pathy = searchPath(y, tree);
        String[] guidePathY = new String[pathy.length];
        for (int i = 0; i < pathy.length; i++) {
            if (pathy[i] != null) {
                guidePathY[i] = pathy[i].guide;
            }
        }
        // output.write("Path from " + tree.root.guide + " to " + y + ": " +
        // Arrays.toString(guidePathY) + "\n");

        // Step 3
        int divergenceLevel = divergenceLevel(pathx, pathy);
        Node divergenceNode = divergenceNode(pathx, pathy);
        if (divergenceNode != null) {
            // output.write("The two nodes diverge at node: " + divergenceNode.guide + " at
            // level " + divergenceLevel + "\n");
        }

        // Step 4 is implemented already

        // Edge case when the height is 0
        if (tree.height == 0 && isInRange(x, y, tree.root.guide)) {
            output.write(tree.root.guide);
            LeafNode p6 = (LeafNode) tree.root;
            output.write(" " + p6.value + "\n");
        } else {
            if (Arrays.equals(pathx, pathy)) {
                // Edge case when the two paths are the same
                if (!isInRange(x, y, pathx[pathx.length - 1].guide)) {
                    return;
                }
                LeafNode p6 = (LeafNode) pathx[pathx.length - 1];
                output.write(guidePathX[pathx.length - 1] + " " + p6.value + "\n");
            } else {
                // Case where the height is 1
                // This is added just to avoid any errors resulting from indices on a tree that
                // would be too small
                if (tree.height == 1) {
                    InternalNode p5 = (InternalNode) tree.root;
                    if (isInRange(x, y, p5.child0.guide)) {
                        printAll(tree, p5.child0, 0);
                    }
                    if (isInRange(x, y, p5.child1.guide)) {
                        printAll(tree, p5.child1, 0);
                    }
                    if (p5.child2 != null && isInRange(x, y, p5.child2.guide)) {
                        printAll(tree, p5.child2, 0);
                    }

                } else {
                    // Step 5
                    for (int i = pathx.length - 1; i > divergenceLevel; i--) {
                        // If is leaf
                        if (i == pathx.length - 1 && tree.height > 1) {
                            InternalNode p2 = (InternalNode) pathx[i - 1];
                            // If the first child is the lower bound
                            if (p2.child0.guide.equals(guidePathX[i])) {
                                if (i - 1 != divergenceLevel) {
                                    if (isInRange(x, y, guidePathX[i])) {
                                        LeafNode p6 = (LeafNode) pathx[i];
                                        output.write(guidePathX[i] + " " + p6.value + "\n");
                                    }
                                    if (isInRange(x, y, p2.child1.guide)) {
                                        output.write(p2.child1.guide + " ");
                                        LeafNode p8 = (LeafNode) p2.child1;
                                        output.write(p8.value + "\n");
                                    }
                                    if (p2.child2 != null) {
                                        if (isInRange(x, y, p2.child2.guide)) {
                                            output.write(p2.child2.guide + " ");
                                            LeafNode p7 = (LeafNode) p2.child2;
                                            output.write(p7.value + "\n");
                                        }
                                    }
                                } else {
                                    LeafNode p6 = (LeafNode) pathx[i];
                                    output.write(guidePathX[i] + " " + p6.value + "\n");
                                }
                            } else {
                                // If the second child is the lower bound
                                if (p2.child1.guide.equals(guidePathX[i])) {
                                    if ((i - 1 != divergenceLevel)) {
                                        if (isInRange(x, y, guidePathX[i])) {
                                            LeafNode p6 = (LeafNode) pathx[i];
                                            output.write(guidePathX[i] + " " + p6.value + "\n");
                                        }
                                        if (p2.child2 != null) {
                                            if (isInRange(x, y, p2.child2.guide)) {
                                                output.write(p2.child2.guide + " ");
                                                LeafNode p7 = (LeafNode) p2.child2;
                                                output.write(p7.value + "\n");
                                            }
                                        }
                                    } else {
                                        LeafNode p6 = (LeafNode) pathx[i];
                                        output.write(guidePathX[i] + " " + p6.value + "\n");
                                    }
                                } else {
                                    // If the third child is the lower bound
                                    if (p2.child2 != null) {
                                        LeafNode p6 = (LeafNode) pathx[i];
                                        output.write(guidePathX[i] + " " + p6.value + "\n");
                                    }
                                }
                            }
                        } else {
                            // If is not leaf
                            if (!pathx[i + 1].getClass().getName().contains("LeafNode")) {
                                InternalNode p3 = (InternalNode) pathx[i];
                                if (p3.child0.guide.equals(guidePathX[i + 1]) && isInRange(x, y, guidePathX[i + 1])) {
                                    printAll(tree, p3.child1, pathx.length - i - 2);
                                    if (p3.child2 != null) {
                                        printAll(tree, p3.child2, pathx.length - i - 2);
                                    }
                                } else {
                                    if (p3.child1.guide.equals(guidePathX[i + 1])
                                            && isInRange(x, y, guidePathX[i + 1])) {
                                        if (p3.child2 != null) {
                                            printAll(tree, p3.child2, pathx.length - i - 2);
                                        }
                                    }
                                }
                            }
                        }
                    }

                    // Step 6
                    InternalNode p4 = (InternalNode) divergenceNode;
                    // If it does diverge
                    if (p4 != null) {
                        // If there is a third child and then validates the left and right nodes
                        if (p4.child2 != null && p4.child0.guide.equals(guidePathX[divergenceLevel + 1])
                                && p4.child2.guide.equals(guidePathY[divergenceLevel + 1])) {
                            printAll(tree, p4.child1, (tree.height - 1) - divergenceLevel);
                        }
                    }

                    // Step 7
                    for (int i = divergenceLevel + 1; i < pathy.length; i++) {
                        // If is leaf
                        if (i == pathy.length - 1 && tree.height > 1) {
                            InternalNode p2 = (InternalNode) pathy[i - 1];
                            // If the first child is the upper bound
                            if (p2.child0.guide.equals(guidePathY[i])) {
                                if (isInRange(x, y, guidePathY[i])) {
                                    LeafNode p6 = (LeafNode) pathy[i];
                                    output.write(guidePathY[i] + " " + p6.value + "\n");
                                }
                            } else {
                                // If the second child is the upper bound
                                if (p2.child1.guide.equals(guidePathY[i])) {
                                    if ((i - 1 != divergenceLevel)) {
                                        if (isInRange(x, y, p2.child0.guide)) {
                                            output.write(p2.child0.guide + " ");
                                            LeafNode p7 = (LeafNode) p2.child0;
                                            output.write(p7.value + "\n");
                                        }
                                        if (isInRange(x, y, guidePathY[i])) {
                                            LeafNode p6 = (LeafNode) pathy[i];
                                            output.write(guidePathY[i] + " " + p6.value + "\n");
                                        }
                                    } else {
                                        LeafNode p6 = (LeafNode) pathy[i];
                                        output.write(guidePathY[i] + " " + p6.value + "\n");
                                    }
                                } else {
                                    if (p2.child2 != null && (i - 1 != divergenceLevel)) {
                                        // If the third child is the upper bound
                                        if (isInRange(x, y, p2.child0.guide)) {
                                            output.write(p2.child0.guide + " ");
                                            LeafNode p7 = (LeafNode) p2.child0;
                                            output.write(p7.value + "\n");
                                        }
                                        if (isInRange(x, y, p2.child1.guide)) {
                                            output.write(p2.child1.guide + " ");
                                            LeafNode p8 = (LeafNode) p2.child1;
                                            output.write(p8.value + "\n");
                                        }
                                        if (isInRange(x, y, guidePathY[i])) {
                                            LeafNode p6 = (LeafNode) pathy[i];
                                            output.write(guidePathY[i] + " " + p6.value + "\n");
                                        }
                                    }
                                }
                            }
                        } else {
                            // Any case where is not a leaf
                            if (!pathy[i + 1].getClass().getName().contains("LeafNode")) {
                                InternalNode p3 = (InternalNode) pathy[i];
                                if (p3.child2 != null && p3.child2.guide.equals(guidePathY[i + 1])) {
                                    printAll(tree, p3.child0, pathy.length - i - 2);
                                    printAll(tree, p3.child1, pathy.length - i - 2);
                                } else {
                                    if (p3.child1.equals(pathy[i + 1])) {
                                        printAll(tree, p3.child0, pathy.length - i - 2);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    // Helper function to do an additional check to make sure that a leaf is really
    // in the range
    // Helps with step 8 and generally filters out unwanted content
    static boolean isInRange(String x, String y, String test) {
        if (y.compareTo(x) <= 0) {
            String temp = x;
            x = y;
            y = temp;
        }
        return (x.compareTo(test) <= 0) && (y.compareTo(test) >= 0);
    }

    static void printAll(TwoThreeTree tree, Node p, int h) throws Exception {
        // Base case
        if (h == 0) {
            LeafNode p0 = (LeafNode) p;
            output.write(p0.guide + " " + p0.value + "\n");
        } else {
            InternalNode p0 = (InternalNode) p;
            // Prints from left to right and decrements "h" by 1 to keep track of how many
            // times the program loops
            printAll(tree, p0.child0, h - 1);
            printAll(tree, p0.child1, h - 1);
            if (p0.child2 != null) {
                printAll(tree, p0.child2, h - 1);
            }
        }
    }

    // Finds the first node that pathx and pathy differ
    static Node divergenceNode(Node[] pathx, Node[] pathy) {
        for (int i = 0; i < pathx.length; i++) {
            if (!((pathx[i].guide).equals(pathy[i].guide))) {
                return pathx[i - 1];
            }
        }
        return null;
    }

    // Finds the first node that pathx and pathy differ
    static int divergenceLevel(Node[] pathx, Node[] pathy) {
        for (int i = 0; i < pathx.length; i++) {
            if (!((pathx[i].guide).equals(pathy[i].guide))) {
                return i - 1;
            }
        }
        return -1;
    }

    // Adapted search from class
    static Node[] searchPath(String x, TwoThreeTree tree) {
        int h = tree.height;
        Node p = tree.root;
        Node[] path = new Node[h + 1];
        for (int i = 0; i < h; i++) {
            InternalNode p0 = (InternalNode) p;
            path[i] = p0;
            if (x.compareTo(p0.child0.guide) <= 0) {
                p = p0.child0;
            } else {
                if (p0.child2 == null || (x.compareTo(p0.child1.guide) <= 0)) {
                    p = p0.child1;
                } else {
                    p = p0.child2;
                }
            }
        }
        LeafNode p1 = (LeafNode) p;
        path[h] = p1;
        return path;
    }

    static int searchFee(String x, TwoThreeTree tree) {
        int h = tree.height;
        Node p = tree.root;
        Node[] path = new Node[h + 1];
        for (int i = 0; i < h; i++) {
            InternalNode p0 = (InternalNode) p;
            path[i] = p0;
            if (x.compareTo(p0.child0.guide) <= 0) {
                p = p0.child0;
            } else {
                if (p0.child2 == null || (x.compareTo(p0.child1.guide) <= 0)) {
                    p = p0.child1;
                } else {
                    p = p0.child2;
                }
            }
        }
        LeafNode p1 = (LeafNode) p;
        if (x.equals(p1.guide)) {
            path[h] = p1;
            int effectiveValue = 0;
            for (int i = 0; i < path.length; i++) {
                effectiveValue += path[i].value;
            }
            return effectiveValue;
        }
        return -1;
    }

    static void insert(String key, int value, TwoThreeTree tree) {
        // insert a key value pair into tree (overwrite existsing value
        // if key is already present)

        int h = tree.height;

        if (h == -1) {
            LeafNode newLeaf = new LeafNode();
            newLeaf.guide = key;
            newLeaf.value = value;
            tree.root = newLeaf;
            tree.height = 0;
        } else {
            WorkSpace ws = doInsert(key, value, tree.root, h);

            if (ws != null && ws.newNode != null) {
                // create a new root

                InternalNode newRoot = new InternalNode();
                if (ws.offset == 0) {
                    newRoot.child0 = ws.newNode;
                    newRoot.child1 = tree.root;
                } else {
                    newRoot.child0 = tree.root;
                    newRoot.child1 = ws.newNode;
                }
                resetGuide(newRoot);
                tree.root = newRoot;
                tree.height = h + 1;
            }
        }
    }

    static WorkSpace doInsert(String key, int value, Node p, int h) {
        // auxiliary recursive routine for insert

        if (h == 0) {
            // we're at the leaf level, so compare and
            // either update value or insert new leaf

            LeafNode leaf = (LeafNode) p; // downcast
            int cmp = key.compareTo(leaf.guide);

            if (cmp == 0) {
                leaf.value = value;
                return null;
            }

            // create new leaf node and insert into tree
            LeafNode newLeaf = new LeafNode();
            newLeaf.guide = key;
            newLeaf.value = value;

            int offset = (cmp < 0) ? 0 : 1;
            // offset == 0 => newLeaf inserted as left sibling
            // offset == 1 => newLeaf inserted as right sibling

            WorkSpace ws = new WorkSpace();
            ws.newNode = newLeaf;
            ws.offset = offset;
            ws.scratch = new Node[4];

            return ws;
        } else {
            InternalNode q = (InternalNode) p; // downcast
            q.child0.value += q.value;
            q.child1.value += q.value;
            if (q.child2 != null) {
                q.child2.value += q.value;
            }
            int pos;
            WorkSpace ws;
            q.value = 0;

            if (key.compareTo(q.child0.guide) <= 0) {
                pos = 0;
                ws = doInsert(key, value, q.child0, h - 1);
            } else if (key.compareTo(q.child1.guide) <= 0 || q.child2 == null) {
                pos = 1;
                ws = doInsert(key, value, q.child1, h - 1);
            } else {
                pos = 2;
                ws = doInsert(key, value, q.child2, h - 1);
            }

            if (ws != null) {
                if (ws.newNode != null) {
                    // make ws.newNode child # pos + ws.offset of q

                    int sz = copyOutChildren(q, ws.scratch);
                    insertNode(ws.scratch, ws.newNode, sz, pos + ws.offset);
                    if (sz == 2) {
                        ws.newNode = null;
                        ws.guideChanged = resetChildren(q, ws.scratch, 0, 3);
                    } else {
                        ws.newNode = new InternalNode();
                        ws.offset = 1;
                        resetChildren(q, ws.scratch, 0, 2);
                        resetChildren((InternalNode) ws.newNode, ws.scratch, 2, 2);
                    }
                } else if (ws.guideChanged) {
                    ws.guideChanged = resetGuide(q);
                }
            }

            return ws;
        }
    }

    static int copyOutChildren(InternalNode q, Node[] x) {
        // copy children of q into x, and return # of children

        int sz = 2;
        x[0] = q.child0;
        x[1] = q.child1;
        if (q.child2 != null) {
            x[2] = q.child2;
            sz = 3;
        }
        return sz;
    }

    static void insertNode(Node[] x, Node p, int sz, int pos) {
        // insert p in x[0..sz) at position pos,
        // moving existing extries to the right

        for (int i = sz; i > pos; i--)
            x[i] = x[i - 1];

        x[pos] = p;
    }

    static boolean resetGuide(InternalNode q) {
        // reset q.guide, and return true if it changes.

        String oldGuide = q.guide;
        if (q.child2 != null)
            q.guide = q.child2.guide;
        else
            q.guide = q.child1.guide;

        return q.guide != oldGuide;
    }

    static boolean resetChildren(InternalNode q, Node[] x, int pos, int sz) {
        // reset q's children to x[pos..pos+sz), where sz is 2 or 3.
        // also resets guide, and returns the result of that

        q.child0 = x[pos];
        q.child1 = x[pos + 1];

        if (sz == 3)
            q.child2 = x[pos + 2];
        else
            q.child2 = null;

        return resetGuide(q);
    }
}
