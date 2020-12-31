import java.util.*;
import java.io.*;

class Node {
    String name;
    long score;
    int position;

    public Node(String name, long score, int position) {
        this.name = name;
        this.score = score;
        this.position = position;
    }

    public String toString() {
        return name + " " + score;
    }
}

class MinHeap {

    public int size;
    public Node[] minHeap;

    public MinHeap(int size) {
        this.size = size;
        this.minHeap = new Node[size];
    }
}

public class Solution {
    static BufferedWriter output;

    // Make score a long!!!!!
    public static void main(String[] args) throws Exception {
        File file = new File(
                "C:/Users/denni/Comp Sci/CSCIUA310/PA3/hash-heap-sample-io/hash-heap-sample-io/input20.txt");

        BufferedReader br = new BufferedReader(new FileReader(file));

        // output = new BufferedWriter(new OutputStreamWriter(System.out, "ASCII"),
        // 4096);

        File file2 = new File(
                "C:/Users/denni/Comp Sci/CSCIUA310/PA3/hash-heap-sample-io/hash-heap-sample-io/myoutput20.txt");
        if (!file2.exists()) {
            file2.createNewFile();
        }
        FileWriter fw = new FileWriter(file2);
        output = new BufferedWriter(fw);
        int n;
        int m;
        char queryType;
        String st;
        String query;
        String name;
        long score;
        if (file.length() != 0) {
            n = Integer.parseInt(br.readLine());
            if (n != 0) {
                MinHeap minHeap = new MinHeap(n);
                HashMap<String, Node> hm = new HashMap<String, Node>();
                for (int i = 0; i < n && ((st = br.readLine()) != null); i++) {
                    name = st.substring(0, st.indexOf(" "));
                    score = Long.parseLong(st.substring(st.indexOf(" ") + 1));
                    Node node = new Node(name, score, i);
                    insert(node, minHeap.minHeap);
                    hm.put(name, node);
                    // output.write(name + " " + score + "\n");
                }
                // System.out.println("-----------Original----------");
                // for (int i = 0; i < n; i++) {
                // System.out.println(minHeap.minHeap[i].toString() + " " +
                // minHeap.minHeap[i].position);
                // }

                m = Integer.parseInt(br.readLine());
                for (int i = 0; i < m && ((st = br.readLine()) != null); i++) {
                    queryType = st.charAt(0);
                    query = st.substring(2);
                    switch (queryType) {
                        case '1':
                            String tempName = query.substring(0, query.indexOf(" "));
                            if (hm.get(tempName) != null) {
                                long improvedBy = Long.parseLong(query.substring(query.indexOf(" ") + 1));
                                // System.out.println(hm.get(tempName).score);
                                hm.get(tempName).score += improvedBy;
                                // System.out.println(hm.get(tempName).score);
                                sinkdown(hm.get(tempName), minHeap);
                                // output.write("1 " + tempName + " " + improvedBy + "\n");
                            }
                            // System.out.println("----------Line: " + (n + 3 + i) + "-----------");
                            // for (int j = 0; j < minHeap.size; j++) {
                            // System.out.println(minHeap.minHeap[j].toString() + " " +
                            // minHeap.minHeap[j].position);
                            // }
                            break;
                        case '2':
                            long standard = Long.parseLong(query);
                            while (minHeap.minHeap[0].score < standard) {
                                deleteMin(minHeap);
                            }
                            // for (int j = 0; j < minHeap.size; j++) {
                            // if (minHeap.minHeap[0].score < standard) {
                            // deleteMin(minHeap);
                            // } else {
                            // break;
                            // }
                            // }
                            // System.out.println("----------Line: " + (n + 3 + i) + "-----------");
                            // for (int j = 0; j < minHeap.size; j++) {
                            // System.out.println(minHeap.minHeap[j].toString() + " " +
                            // minHeap.minHeap[j].position);
                            // }
                            output.write(minHeap.size + "\n");
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

    static int parent(int position) {
        return (int) (position - 1) / 2;
    }

    static int leftChild(int position) {
        return (2 * position) + 1;
    }

    static int rightChild(int position) {
        return (2 * position) + 2;
    }

    static void insert(Node node, Node[] minHeap) {
        int position = node.position;
        minHeap[position] = node;
        // for (int i = 0; i < ((int) (Math.log(position) / Math.log(2))); i++) {
        while ((minHeap[position].score) < (minHeap[parent(position)].score)) {
            Node temp = minHeap[position];
            minHeap[position] = minHeap[parent(position)];
            minHeap[position].position = position;
            minHeap[parent(position)] = temp;
            minHeap[parent(position)].position = parent(position);
            position = parent(position);
        } /*
           * else { break; }
           */
        // }
    }

    static void pointTo() {

    }

    static void sinkdown(Node node, MinHeap minHeap) {
        int position = node.position;
        for (int i = 0; i < ((int) (Math.log(minHeap.size) / Math.log(2))); i++) {
            if ((!(leftChild(position) >= minHeap.size)
                    && (minHeap.minHeap[position].score) > (minHeap.minHeap[leftChild(position)].score))
                    && (!(rightChild(position) >= minHeap.size)
                            && (minHeap.minHeap[position].score) > (minHeap.minHeap[rightChild(position)].score))) {
                if ((minHeap.minHeap[leftChild(position)].score) < (minHeap.minHeap[rightChild(position)].score)) {
                    Node temp = minHeap.minHeap[position];
                    minHeap.minHeap[position] = minHeap.minHeap[leftChild(position)];
                    minHeap.minHeap[position].position = position;
                    minHeap.minHeap[leftChild(position)] = temp;
                    minHeap.minHeap[leftChild(position)].position = leftChild(position);
                    position = leftChild(position);
                } else {
                    Node temp = minHeap.minHeap[position];
                    minHeap.minHeap[position] = minHeap.minHeap[rightChild(position)];
                    minHeap.minHeap[position].position = position;
                    minHeap.minHeap[rightChild(position)] = temp;
                    minHeap.minHeap[rightChild(position)].position = rightChild(position);
                    position = rightChild(position);
                }
            } else {
                if (!(leftChild(position) >= minHeap.size)
                        && (minHeap.minHeap[position].score) > (minHeap.minHeap[leftChild(position)].score)
                        || ((rightChild(position) >= minHeap.size) && !(leftChild(position) >= minHeap.size)
                                && (minHeap.minHeap[position].score) > (minHeap.minHeap[leftChild(position)].score))) {
                    Node temp = minHeap.minHeap[position];
                    minHeap.minHeap[position] = minHeap.minHeap[leftChild(position)];
                    minHeap.minHeap[position].position = position;
                    minHeap.minHeap[leftChild(position)] = temp;
                    minHeap.minHeap[leftChild(position)].position = leftChild(position);
                    position = leftChild(position);
                } else {
                    if (!(rightChild(position) >= minHeap.size)
                            && (minHeap.minHeap[position].score) > (minHeap.minHeap[rightChild(position)].score)) {
                        Node temp = minHeap.minHeap[position];
                        minHeap.minHeap[position] = minHeap.minHeap[rightChild(position)];
                        minHeap.minHeap[position].position = position;
                        minHeap.minHeap[rightChild(position)] = temp;
                        minHeap.minHeap[rightChild(position)].position = rightChild(position);
                        position = rightChild(position);
                    } else {
                        break;
                    }
                }
            }
        }
        /*
         * minHeap.minHeap[position] = node; for (int i = 0; i < ((int)
         * (Math.log(minHeap.size) / Math.log(2))); i++) { if (!(leftChild(position) >=
         * minHeap.size) && (minHeap.minHeap[position].score) >
         * (minHeap.minHeap[leftChild(position)].score)) { Node temp =
         * minHeap.minHeap[position]; minHeap.minHeap[position] =
         * minHeap.minHeap[leftChild(position)]; minHeap.minHeap[leftChild(position)] =
         * temp; minHeap.minHeap[leftChild(position)].position = position; position =
         * leftChild(position); } else { if (!(rightChild(position) >= minHeap.size) &&
         * (minHeap.minHeap[position].score) >
         * (minHeap.minHeap[rightChild(position)].score)) { Node temp =
         * minHeap.minHeap[position]; minHeap.minHeap[position] =
         * minHeap.minHeap[rightChild(position)]; minHeap.minHeap[rightChild(position)]
         * = temp; minHeap.minHeap[rightChild(position)].position = position; position =
         * rightChild(position); } else { break; } } }
         */
    }

    static void deleteMin(MinHeap minHeap) {
        minHeap.minHeap[0] = minHeap.minHeap[minHeap.size - 1];
        minHeap.minHeap[0].position = 0;
        minHeap.size--;
        sinkdown(minHeap.minHeap[0], minHeap);
    }
}