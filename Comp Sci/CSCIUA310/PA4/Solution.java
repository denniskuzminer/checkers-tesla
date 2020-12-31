import java.util.*;
import java.io.*;
import java.lang.reflect.Array;

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
        // add an edge i -> j to the graph

        A[u] = new Item(v, A[u]);
    }
}

// Data structure holding data computed by DFS
class DFSInfo {

    // node colors
    static final int WHITE = 0;
    static final int GRAY = 1;
    static final int BLACK = 2;

    int[] color; // variable storing the color
                 // of each node during DFS
                 // (WHITE, GRAY, or BLACK)

    int[] parent; // variable storing the parent
                  // of each node in the DFS forest

    int d[]; // variable storing the discovery time
             // of each node in the DFS forest

    int f[]; // variable storing the finish time
             // of each node in the DFS forest

    DFSInfo(Graph graph) {
        int n = graph.n;
        color = new int[n];
        parent = new int[n];
        d = new int[n];
        f = new int[n];
    }
}

// your "main program" should look something like this:

class Solution {
    static int time;
    static ArrayList<Integer> cycle;

    static void recDFS(int u, Graph graph, DFSInfo info) {
        // perform a recursive DFS, starting at u
        info.color[u] = 1;
        info.d[u] = ++time;
        Item curr = graph.A[u];
        while (curr != null) {
            int v = curr.data;
            if (info.color[v] == 0) {
                info.parent[v] = u;
                recDFS(v, graph, info);
            }
            curr = curr.next;
        }
        info.color[u] = 2;
        info.f[u] = ++time;

        /*
         * for (int i = 1; i < n; i++) { if (g.A[i] != null) { ArrayList<Item>
         * successors = new ArrayList<Item>(); Item curr = g.A[i]; while (curr != null)
         * { successors.add(curr); System.out.println(i + " " + curr.data); curr =
         * curr.next; } } }
         * 
         * 
         * 
         * 
         * 
         * 
         * 
         * 
         * 
         * int index = -1; for (int i = 0; i < graph.n; i++) { if (graph.A[i] != null &&
         * graph.A[i].data == u) { index = i; break; } } info.color[index] = 1;
         * info.d[index] = ++time; ArrayList<Item> successors = new ArrayList<Item>();
         * for (int i = 0; i < graph.n; i++) { if (graph.A[i] != null &&
         * graph.A[index].data == graph.A[i].data) { successors.add(graph.A[i].next); }
         * } for (Item successor : successors) { int successorIndex = -1; for (int i =
         * 0; i < graph.n; i++) { if ((graph.A[i] != null && successor != null) &&
         * graph.A[i].data == successor.data) { successorIndex = i; break; } } if
         * (successorIndex != -1 && info.color[successorIndex] == 0) {
         * info.parent[successorIndex] = u; recDFS(successor.data, graph, info); } }
         * info.color[index] = 2; info.f[index] = ++time;
         */

        /*
         * for (int i = 0; i < numSuccessors; i++) { if (graph.A[index].next.data == ) {
         * successors; } }
         */

    }

    static DFSInfo DFS(Graph graph) {
        // performs a "full" DFS on given graph
        DFSInfo info = new DFSInfo(graph);
        for (int i = 1; i < graph.n; i++) {
            info.parent[i] = 0;
            info.color[i] = 0;
        }
        time = 0;
        for (int i = 1; i < graph.n; i++) {
            if (info.color[i] == 0) {
                if (graph.A[i] != null) {
                    recDFS(i, graph, info);
                }
            }
        }
        return info;
    }

    static boolean existsEdge(Graph graph, int u, int v) {
        // if there is an edge from u to v
        Item curr = graph.A[u];
        while (curr != null) {
            if (curr.data == v) {
                return true;
            }
            curr = curr.next;
        }
        return false;
    }

    static Item findCycle(Graph graph, DFSInfo info) {
        // If graph contains a cycle x_1 -> ... x_k -> x_1,
        // return a pointer to the head of the linked list
        // (x_1,..., x_k); otherwise, return null.
        // NOTE: if there is a cycle, you should just return
        // one cycle --- it does not matter which one.

        // To do this, scan through the edges of graph,
        // using info.f to locate a back edge.
        // Once you find a back edge, use info.parent
        // to build the list of nodes in the cycle
        // in the correct order.

        // if (u lies below v possibly equal) d[v] <= d[u] < f[u] <= f[v]
        // and maybe say if there exists some edge v to u
        for (int u = 1; u < graph.n; u++) {
            Item currItem = graph.A[u];
            while (currItem != null) {
                int v = currItem.data;
                if (u == v /* && existsEdge(graph, u, v) */) {
                    cycle.add(v);
                    return graph.A[v];
                }
                if ((/* info.d[v] <= info.d[u] && info.d[u] < info.f[u] && */ info.f[u] <= info.f[v])
                /* && existsEdge(graph, u, v) */) {
                    int curr = u;
                    // System.out.println(v + " " + u + " " + info.parent[v] + " " +
                    // info.parent[info.parent[v]]);
                    cycle = new ArrayList<Integer>();
                    cycle.add(u);
                    while (info.parent[curr] != v && info.parent[curr] != 0) {
                        // System.out.println(v + " " + u + " " + curr);
                        cycle.add(info.parent[curr]);
                        curr = info.parent[curr];
                    }
                    cycle.add(v);
                    return graph.A[v];
                    // there is a cycle
                }

                currItem = currItem.next;
            }

        }
        return null;
    }

    static BufferedWriter output;

    public static void main(String[] args) throws Exception {

        File file = new File("C:/Users/denni/Comp Sci/CSCIUA310/PA4/cycle-detection-sample-io/test1.in");

        BufferedReader br = new BufferedReader(new FileReader(file));

        output = new BufferedWriter(new OutputStreamWriter(System.out, "ASCII"), 4096);

        int n;
        int m;
        String st;
        st = br.readLine();
        n = 1 + Integer.parseInt(st.substring(0, st.indexOf(" ")));
        Graph g = new Graph(n);
        m = Integer.parseInt(st.substring(st.indexOf(" ") + 1));
        if (n != 0) {
            for (int i = 0; i < m && ((st = br.readLine()) != null); i++) {
                g.addEdge(Integer.parseInt(st.substring(0, st.indexOf(" "))),
                        Integer.parseInt(st.substring(st.indexOf(" ") + 1)));
            }
            // for (int i = 1; i < n; i++) {
            // if (g.A[i] != null) {
            // ArrayList<Item> successors = new ArrayList<Item>();
            // Item curr = g.A[i];
            // while (curr != null) {
            // successors.add(curr);
            // System.out.println(i + " " + curr.data);
            // curr = curr.next;
            // }
            // }
            // }
            if (findCycle(g, DFS(g)) == null) {
                output.write("0\n");
            } else {
                output.write("1\n");
                String cyString = "";
                for (int i = cycle.size() - 1; i >= 0; i--) {
                    cyString += cycle.get(i) + " ";
                }
                // for (Integer node : cycle) {
                // cyString += node + " ";
                // }
                output.write(cyString + "\n");
            }
        }
        output.flush();
        br.close();
    }
}