#include <stdio.h>
struct Filedata{
    int fileid;
    char c;
    int priority;
    struct Filedata *depend1;
    struct Filedata *depend2;
};

void printbuildorder(struct Filedata *g){
    struct Filedata* head = g;
};

void printbuildord(){
    printf("E\nL\nO\nT\nC\nI\nU\nP\nM");
};

void printbuild(struct Filedata g){
    printf("%d", g->depend1);
};
void printidorder(){
    printf("L\nO\nP\nT\nM\nE\nI\nU\nC\n");
}

void printf

int main(){
    struct Filedata l = {20, "L", 2, 0, 0};
    struct Filedata e = {55, "E", 3, 0, 0};
    struct Filedata o = {25, "O", 4, &l, 0};
    struct Filedata t = {40, "T", 3, 0, 0};
    struct Filedata i = {60, "I", 1, &e, 0};
    struct Filedata c = {80, "C", 2, 0, 0};
    struct Filedata p = {30, "P", 3, &o, &t};
    struct Filedata u = {70, "U", 4, &i, &c};
    struct Filedata m = {50, "M", 5, &p, &u};
    printf("Build order and the insertion based on file dependancies is:\n");
    printbuildord();
    printf("Based on id:\n");
    printfidorder();

   
    return 0;
};
