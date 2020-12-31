import java.util.*;
import java.io.*;

// Data structure for a node in a linked list
class Item {
    int data;
    Item next;

    Item(int data, Item next) {
        this.data = data;
        this.next = next;
    }
}

// Data structure for representing a graph
class Graph {
    int n; // # of nodes in the graph

    Item[] A;
    // For u in [0..n), A[u] is the adjecency list for u

    Graph(int n) {
        // initialize a graph with n vertices and no edges
        this.n = n;
        A = new Item[n];
    }

    void addEdge(int u, int v) {
        // add an edge u -> v to the graph

        A[u] = new Item(v, A[u]);
    }
}

// Data structure holding data computed by DFS
class DFSInfo {
    int k;
    // # of trees in DFS forest

    int[] T;
    // For u in [0..n), T[u] is initially 0, but when DFS discovers
    // u, T[u] is set to the index (which is in [1..k]) of the tree
    // in DFS forest in which u belongs.

    int[] L;
    // List of nodes in order of decreasing finishing time

    int count;
    // initially set to n, and is decremented every time
    // DFS finishes with a node and is recorded in L

    DFSInfo(Graph graph) {
        int n = graph.n;
        k = 0;
        T = new int[n];
        L = new int[n];
        count = n;
    }
}

// your "main program" should look something like this:

public class Solution {

    static int time;

    static void recDFS(int u, Graph graph, DFSInfo info) {
        // perform a recursive DFS, starting at u
        info.T[u] = info.k;
        for (Item curr = graph.A[u]; curr != null; curr = curr.next) {
            int v = curr.data;
            if (info.T[v] == 0) {
                recDFS(v, graph, info);
            }
        }
        info.L[--info.count] = u;
    }

    static DFSInfo DFS(int[] order, Graph graph) {
        // performs a "full" DFS on given graph, processing
        // nodes in the order specified (i.e., order[0], order[1], ...)
        // in the main loop.
        DFSInfo info = new DFSInfo(graph);
        for (int i = 0; i < graph.n; i++) {
            info.T[i] = 0;
        }
        time = 0;
        for (int i : order) {
            if (info.T[i] == 0) {
                info.k++;
                recDFS(i, graph, info);
            }
        }
        return info;
    }

    static boolean[] computeSafeNodes(Graph graph, DFSInfo info) {
        // returns a boolean array indicating which nodes
        // are safe nodes. The DFSInfo is that computed from the
        // second DFS.
        int[] notSinks = new int[info.k + 1];
        boolean[] safeNodes = new boolean[graph.n];
        Arrays.fill(notSinks, -1);
        for (int u = 0; u < graph.n; u++) {
            if (graph.A[u] != null) {
                for (Item curr = graph.A[u]; curr != null; curr = curr.next) {
                    if (info.T[u] != info.T[curr.data]) {
                        // this cannot be a sink every node in the component of u is not a sink
                        notSinks[info.T[u]] = info.T[u];
                    }
                }
            }
        }
        for (int u = 0; u < graph.n; u++) {
            if (notSinks[info.T[u]] == -1) {
                safeNodes[u] = true;
            }
        }
        return safeNodes;
    }

    static Graph reverse(Graph graph) {
        // returns the reverse of the given graph
        Graph gT = new Graph(graph.n);
        for (int u = 0; u < graph.n; u++) {
            for (Item curr = graph.A[u]; curr != null; curr = curr.next) {
                gT.addEdge(curr.data, u);
            }
        }
        return gT;
    }

    static BufferedWriter output;

    public static void main(String[] args) throws Exception {
        // BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        File file = new File("C:/Users/denni/Comp Sci/CSCIUA310/PA5/scc-sample-IO/input0.txt");
        BufferedReader br = new BufferedReader(new FileReader(file));
        output = new BufferedWriter(new OutputStreamWriter(System.out, "ASCII"), 4096);

        int n;
        int m;
        String st;
        st = br.readLine();
        n = Integer.parseInt(st.substring(0, st.indexOf(" ")));
        Graph g = new Graph(n);
        Graph reverseg = new Graph(n);
        m = Integer.parseInt(st.substring(st.indexOf(" ") + 1));
        if (n != 0) {
            for (int i = 0; i < m && ((st = br.readLine()) != null); i++) {
                g.addEdge(Integer.parseInt(st.substring(0, st.indexOf(" "))),
                        Integer.parseInt(st.substring(st.indexOf(" ") + 1)));
                // Step 1
                reverseg.addEdge(Integer.parseInt(st.substring(st.indexOf(" ") + 1)),
                        Integer.parseInt(st.substring(0, st.indexOf(" "))));
            }
        }
        int[] initOrder = new int[n];
        for (int i = 0; i < n; i++) {
            initOrder[i] = i;
        }
        // Step 2
        DFSInfo revinfo = DFS(initOrder, reverse(g));
        // System.out.println("First time: " + Arrays.toString(revinfo.L));
        // Step 3
        DFSInfo info = DFS(revinfo.L, g);
        // System.out.println("Second time: " + Arrays.toString(info.L));
        // Find sinks
        boolean[] safeNodes = computeSafeNodes(g, info);
        for (int u = 0; u < safeNodes.length; u++) {
            if (safeNodes[u]) {
                System.out.print(u + " ");
            }
        }
        output.flush();
        br.close();
    }
}