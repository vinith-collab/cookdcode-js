// Starter code templates and default STDIN for all 21 problems in JavaScript, Python, C++, C, Java

export const PROBLEM_TEMPLATES = {
  "problem01": {
    id: "problem01",
    canonicalId: "odd-even",
    title: "Odd or Even",
    stdin: "4",
    templates: {
      javascript: `// Problem 1: Odd or Even Checker
let num = 4;

if (num % 2 === 0) {
    console.log("Even");
} else {
    console.log("Odd");
}`,
      python: `# Problem 1: Odd or Even Checker
num = int(input())

if num % 2 == 0:
    print("Even")
else:
    print("Odd")`,
      cpp: `// Problem 1: Odd or Even Checker
#include <iostream>
using namespace std;

int main() {
    int num;
    if (cin >> num) {
        if (num % 2 == 0) {
            cout << "Even" << endl;
        } else {
            cout << "Odd" << endl;
        }
    }
    return 0;
}`,
      c: `// Problem 1: Odd or Even Checker
#include <stdio.h>

int main() {
    int num;
    if (scanf("%d", &num) == 1) {
        if (num % 2 == 0) {
            printf("Even\\n");
        } else {
            printf("Odd\\n");
        }
    }
    return 0;
}`,
      java: `// Problem 1: Odd or Even Checker
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        if (scanner.hasNextInt()) {
            int num = scanner.nextInt();
            if (num % 2 == 0) {
                System.out.println("Even");
            } else {
                System.out.println("Odd");
            }
        }
    }
}`
    }
  },

  "problem02": {
    id: "problem02",
    canonicalId: "sum-natural-numbers",
    title: "Sum of N Natural Numbers",
    stdin: "5",
    templates: {
      javascript: `// Problem 2: Sum of N Natural Numbers
let n = 5;
let sum = 0;

for (let i = 1; i <= n; i++) {
    sum += i;
}

console.log(sum);`,
      python: `# Problem 2: Sum of N Natural Numbers
n = int(input())
sum_val = 0

for i in range(1, n + 1):
    sum_val += i

print(sum_val)`,
      cpp: `// Problem 2: Sum of N Natural Numbers
#include <iostream>
using namespace std;

int main() {
    int n;
    if (cin >> n) {
        int sum = 0;
        for (int i = 1; i <= n; i++) {
            sum += i;
        }
        cout << sum << endl;
    }
    return 0;
}`,
      c: `// Problem 2: Sum of N Natural Numbers
#include <stdio.h>

int main() {
    int n;
    if (scanf("%d", &n) == 1) {
        int sum = 0;
        for (int i = 1; i <= n; i++) {
            sum += i;
        }
        printf("%d\\n", sum);
    }
    return 0;
}`,
      java: `// Problem 2: Sum of N Natural Numbers
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        if (scanner.hasNextInt()) {
            int n = scanner.nextInt();
            int sum = 0;
            for (int i = 1; i <= n; i++) {
                sum += i;
            }
            System.out.println(sum);
        }
    }
}`
    }
  },

  "problem03": {
    id: "problem03",
    canonicalId: "factorial",
    title: "Factorial of a Number",
    stdin: "5",
    templates: {
      javascript: `// Problem 3: Factorial of a Number
let n = 5;
let fact = 1;

for (let i = 1; i <= n; i++) {
    fact *= i;
}

console.log(fact);`,
      python: `# Problem 3: Factorial of a Number
n = int(input())
fact = 1

for i in range(1, n + 1):
    fact *= i

print(fact)`,
      cpp: `// Problem 3: Factorial of a Number
#include <iostream>
using namespace std;

int main() {
    int n;
    if (cin >> n) {
        long long fact = 1;
        for (int i = 1; i <= n; i++) {
            fact *= i;
        }
        cout << fact << endl;
    }
    return 0;
}`,
      c: `// Problem 3: Factorial of a Number
#include <stdio.h>

int main() {
    int n;
    if (scanf("%d", &n) == 1) {
        long long fact = 1;
        for (int i = 1; i <= n; i++) {
            fact *= i;
        }
        printf("%lld\\n", fact);
    }
    return 0;
}`,
      java: `// Problem 3: Factorial of a Number
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        if (scanner.hasNextInt()) {
            int n = scanner.nextInt();
            long fact = 1;
            for (int i = 1; i <= n; i++) {
                fact *= i;
            }
            System.out.println(fact);
        }
    }
}`
    }
  },

  "problem04": {
    id: "problem04",
    canonicalId: "divisor-of-a-number",
    title: "Divisors of a Number",
    stdin: "6",
    templates: {
      javascript: `// Problem 4: Divisors of a Number
let n = 6;

for (let i = 1; i <= n; i++) {
    if (n % i === 0) {
        console.log(i);
    }
}`,
      python: `# Problem 4: Divisors of a Number
n = int(input())

for i in range(1, n + 1):
    if n % i == 0:
        print(i)`,
      cpp: `// Problem 4: Divisors of a Number
#include <iostream>
using namespace std;

int main() {
    int n;
    if (cin >> n) {
        for (int i = 1; i <= n; i++) {
            if (n % i == 0) {
                cout << i << endl;
            }
        }
    }
    return 0;
}`,
      c: `// Problem 4: Divisors of a Number
#include <stdio.h>

int main() {
    int n;
    if (scanf("%d", &n) == 1) {
        for (int i = 1; i <= n; i++) {
            if (n % i == 0) {
                printf("%d\\n", i);
            }
        }
    }
    return 0;
}`,
      java: `// Problem 4: Divisors of a Number
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        if (scanner.hasNextInt()) {
            int n = scanner.nextInt();
            for (int i = 1; i <= n; i++) {
                if (n % i == 0) {
                    System.out.println(i);
                }
            }
        }
    }
}`
    }
  },

  "problem05": {
    id: "problem05",
    canonicalId: "prime-number",
    title: "Prime Number Checker",
    stdin: "7",
    templates: {
      javascript: `// Problem 5: Prime Number Checker
let n = 7;

if (n <= 1) {
    console.log("Not Prime");
} else {
    let isPrime = true;
    for (let i = 2; i * i <= n; i++) {
        if (n % i === 0) {
            isPrime = false;
            break;
        }
    }
    console.log(isPrime ? "Prime" : "Not Prime");
}`,
      python: `# Problem 5: Prime Number Checker
n = int(input())

if n <= 1:
    print("Not Prime")
else:
    is_prime = True
    for i in range(2, int(n**0.5) + 1):
        if n % i == 0:
            is_prime = False
            break
    print("Prime" if is_prime else "Not Prime")`,
      cpp: `// Problem 5: Prime Number Checker
#include <iostream>
using namespace std;

int main() {
    int n;
    if (cin >> n) {
        if (n <= 1) {
            cout << "Not Prime" << endl;
        } else {
            bool isPrime = true;
            for (int i = 2; i * i <= n; i++) {
                if (n % i == 0) {
                    isPrime = false;
                    break;
                }
            }
            cout << (isPrime ? "Prime" : "Not Prime") << endl;
        }
    }
    return 0;
}`,
      c: `// Problem 5: Prime Number Checker
#include <stdio.h>
#include <stdbool.h>

int main() {
    int n;
    if (scanf("%d", &n) == 1) {
        if (n <= 1) {
            printf("Not Prime\\n");
        } else {
            bool isPrime = true;
            for (int i = 2; i * i <= n; i++) {
                if (n % i == 0) {
                    isPrime = false;
                    break;
                }
            }
            printf("%s\\n", isPrime ? "Prime" : "Not Prime");
        }
    }
    return 0;
}`,
      java: `// Problem 5: Prime Number Checker
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        if (scanner.hasNextInt()) {
            int n = scanner.nextInt();
            if (n <= 1) {
                System.out.println("Not Prime");
            } else {
                boolean isPrime = true;
                for (int i = 2; i * i <= n; i++) {
                    if (n % i == 0) {
                        isPrime = false;
                        break;
                    }
                }
                System.out.println(isPrime ? "Prime" : "Not Prime");
            }
        }
    }
}`
    }
  },

  "problem06": {
    id: "problem06",
    canonicalId: "next-prime-number",
    title: "Next Prime Number",
    stdin: "7",
    templates: {
      javascript: `// Problem 6: Next Prime Number
let n = 7;

function isPrime(num) {
    if (num <= 1) return false;
    for (let i = 2; i * i <= num; i++) {
        if (num % i === 0) return false;
    }
    return true;
}

let next = n + 1;
while (!isPrime(next)) {
    next++;
}

console.log(next);`,
      python: `# Problem 6: Next Prime Number
n = int(input())

def is_prime(num):
    if num <= 1:
        return False
    for i in range(2, int(num**0.5) + 1):
        if num % i == 0:
            return False
    return True

nxt = n + 1
while not is_prime(nxt):
    nxt += 1

print(nxt)`,
      cpp: `// Problem 6: Next Prime Number
#include <iostream>
using namespace std;

bool isPrime(int num) {
    if (num <= 1) return false;
    for (int i = 2; i * i <= num; i++) {
        if (num % i == 0) return false;
    }
    return true;
}

int main() {
    int n;
    if (cin >> n) {
        int nxt = n + 1;
        while (!isPrime(nxt)) {
            nxt++;
        }
        cout << nxt << endl;
    }
    return 0;
}`,
      c: `// Problem 6: Next Prime Number
#include <stdio.h>
#include <stdbool.h>

bool isPrime(int num) {
    if (num <= 1) return false;
    for (int i = 2; i * i <= num; i++) {
        if (num % i == 0) return false;
    }
    return true;
}

int main() {
    int n;
    if (scanf("%d", &n) == 1) {
        int nxt = n + 1;
        while (!isPrime(nxt)) {
            nxt++;
        }
        printf("%d\\n", nxt);
    }
    return 0;
}`,
      java: `// Problem 6: Next Prime Number
import java.util.Scanner;

public class Main {
    static boolean isPrime(int num) {
        if (num <= 1) return false;
        for (int i = 2; i * i <= num; i++) {
            if (num % i == 0) return false;
        }
        return true;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        if (scanner.hasNextInt()) {
            int n = scanner.nextInt();
            int nxt = n + 1;
            while (!isPrime(nxt)) {
                nxt++;
            }
            System.out.println(nxt);
        }
    }
}`
    }
  },

  "problem07": {
    id: "problem07",
    canonicalId: "prime-between-range",
    title: "Prime Numbers in a Range",
    stdin: "10 20",
    templates: {
      javascript: `// Problem 7: Prime Numbers in a Range
let start = 10;
let end = 20;

function isPrime(num) {
    if (num <= 1) return false;
    for (let i = 2; i * i <= num; i++) {
        if (num % i === 0) return false;
    }
    return true;
}

for (let i = start; i <= end; i++) {
    if (isPrime(i)) {
        console.log(i);
    }
}`,
      python: `# Problem 7: Prime Numbers in a Range
inputs = input().split()
start = int(inputs[0]) if len(inputs) > 0 else 10
end = int(inputs[1]) if len(inputs) > 1 else 20

def is_prime(num):
    if num <= 1:
        return False
    for i in range(2, int(num**0.5) + 1):
        if num % i == 0:
            return False
    return True

for i in range(start, end + 1):
    if is_prime(i):
        print(i)`,
      cpp: `// Problem 7: Prime Numbers in a Range
#include <iostream>
using namespace std;

bool isPrime(int num) {
    if (num <= 1) return false;
    for (int i = 2; i * i <= num; i++) {
        if (num % i == 0) return false;
    }
    return true;
}

int main() {
    int start, end;
    if (cin >> start >> end) {
        for (int i = start; i <= end; i++) {
            if (isPrime(i)) {
                cout << i << endl;
            }
        }
    }
    return 0;
}`,
      c: `// Problem 7: Prime Numbers in a Range
#include <stdio.h>
#include <stdbool.h>

bool isPrime(int num) {
    if (num <= 1) return false;
    for (int i = 2; i * i <= num; i++) {
        if (num % i == 0) return false;
    }
    return true;
}

int main() {
    int start, end;
    if (scanf("%d %d", &start, &end) == 2) {
        for (int i = start; i <= end; i++) {
            if (isPrime(i)) {
                printf("%d\\n", i);
            }
        }
    }
    return 0;
}`,
      java: `// Problem 7: Prime Numbers in a Range
import java.util.Scanner;

public class Main {
    static boolean isPrime(int num) {
        if (num <= 1) return false;
        for (int i = 2; i * i <= num; i++) {
            if (num % i == 0) return false;
        }
        return true;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        if (scanner.hasNextInt()) {
            int start = scanner.nextInt();
            int end = scanner.hasNextInt() ? scanner.nextInt() : 20;
            for (int i = start; i <= end; i++) {
                if (isPrime(i)) {
                    System.out.println(i);
                }
            }
        }
    }
}`
    }
  },

  "problem08": {
    id: "problem08",
    canonicalId: "sexy-prime-number",
    title: "Sexy Prime Pairs",
    stdin: "30",
    templates: {
      javascript: `// Problem 8: Sexy Prime Pairs (differ by 6)
let limit = 30;

function isPrime(num) {
    if (num <= 1) return false;
    for (let i = 2; i * i <= num; i++) {
        if (num % i === 0) return false;
    }
    return true;
}

for (let p = 2; p + 6 <= limit; p++) {
    if (isPrime(p) && isPrime(p + 6)) {
        console.log("(" + p + ", " + (p + 6) + ")");
    }
}`,
      python: `# Problem 8: Sexy Prime Pairs (differ by 6)
limit = int(input())

def is_prime(num):
    if num <= 1:
        return False
    for i in range(2, int(num**0.5) + 1):
        if num % i == 0:
            return False
    return True

for p in range(2, limit - 5):
    if is_prime(p) and is_prime(p + 6):
        print(f"({p}, {p + 6})")`,
      cpp: `// Problem 8: Sexy Prime Pairs
#include <iostream>
using namespace std;

bool isPrime(int num) {
    if (num <= 1) return false;
    for (int i = 2; i * i <= num; i++) {
        if (num % i == 0) return false;
    }
    return true;
}

int main() {
    int limit;
    if (cin >> limit) {
        for (int p = 2; p + 6 <= limit; p++) {
            if (isPrime(p) && isPrime(p + 6)) {
                cout << "(" << p << ", " << p + 6 << ")" << endl;
            }
        }
    }
    return 0;
}`,
      c: `// Problem 8: Sexy Prime Pairs
#include <stdio.h>
#include <stdbool.h>

bool isPrime(int num) {
    if (num <= 1) return false;
    for (int i = 2; i * i <= num; i++) {
        if (num % i == 0) return false;
    }
    return true;
}

int main() {
    int limit;
    if (scanf("%d", &limit) == 1) {
        for (int p = 2; p + 6 <= limit; p++) {
            if (isPrime(p) && isPrime(p + 6)) {
                printf("(%d, %d)\\n", p, p + 6);
            }
        }
    }
    return 0;
}`,
      java: `// Problem 8: Sexy Prime Pairs
import java.util.Scanner;

public class Main {
    static boolean isPrime(int num) {
        if (num <= 1) return false;
        for (int i = 2; i * i <= num; i++) {
            if (num % i == 0) return false;
        }
        return true;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        if (scanner.hasNextInt()) {
            int limit = scanner.nextInt();
            for (int p = 2; p + 6 <= limit; p++) {
                if (isPrime(p) && isPrime(p + 6)) {
                    System.out.println("(" + p + ", " + (p + 6) + ")");
                }
            }
        }
    }
}`
    }
  },

  "problem09": {
    id: "problem09",
    canonicalId: "positive-negative",
    title: "Positive, Negative, or Zero",
    stdin: "5",
    templates: {
      javascript: `// Problem 9: Positive, Negative, or Zero
let n = 5;

if (n > 0) {
    console.log("Positive");
} else if (n < 0) {
    console.log("Negative");
} else {
    console.log("Zero");
}`,
      python: `# Problem 9: Positive, Negative, or Zero
n = int(input())

if n > 0:
    print("Positive")
elif n < 0:
    print("Negative")
else:
    print("Zero")`,
      cpp: `// Problem 9: Positive, Negative, or Zero
#include <iostream>
using namespace std;

int main() {
    int n;
    if (cin >> n) {
        if (n > 0) {
            cout << "Positive" << endl;
        } else if (n < 0) {
            cout << "Negative" << endl;
        } else {
            cout << "Zero" << endl;
        }
    }
    return 0;
}`,
      c: `// Problem 9: Positive, Negative, or Zero
#include <stdio.h>

int main() {
    int n;
    if (scanf("%d", &n) == 1) {
        if (n > 0) {
            printf("Positive\\n");
        } else if (n < 0) {
            printf("Negative\\n");
        } else {
            printf("Zero\\n");
        }
    }
    return 0;
}`,
      java: `// Problem 9: Positive, Negative, or Zero
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        if (scanner.hasNextInt()) {
            int n = scanner.nextInt();
            if (n > 0) {
                System.out.println("Positive");
            } else if (n < 0) {
                System.out.println("Negative");
            } else {
                System.out.println("Zero");
            }
        }
    }
}`
    }
  },

  "problem10": {
    id: "problem10",
    canonicalId: "three-digit-number",
    title: "3-Digit Number Checker",
    stdin: "456",
    templates: {
      javascript: `// Problem 10: 3-Digit Number Checker
let n = 456;

if (Math.abs(n) >= 100 && Math.abs(n) <= 999) {
    console.log("Yes");
} else {
    console.log("No");
}`,
      python: `# Problem 10: 3-Digit Number Checker
n = abs(int(input()))

if 100 <= n <= 999:
    print("Yes")
else:
    print("No")`,
      cpp: `// Problem 10: 3-Digit Number Checker
#include <iostream>
#include <cmath>
using namespace std;

int main() {
    int n;
    if (cin >> n) {
        int val = abs(n);
        if (val >= 100 && val <= 999) {
            cout << "Yes" << endl;
        } else {
            cout << "No" << endl;
        }
    }
    return 0;
}`,
      c: `// Problem 10: 3-Digit Number Checker
#include <stdio.h>
#include <stdlib.h>

int main() {
    int n;
    if (scanf("%d", &n) == 1) {
        int val = abs(n);
        if (val >= 100 && val <= 999) {
            printf("Yes\\n");
        } else {
            printf("No\\n");
        }
    }
    return 0;
}`,
      java: `// Problem 10: 3-Digit Number Checker
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        if (scanner.hasNextInt()) {
            int n = Math.abs(scanner.nextInt());
            if (n >= 100 && n <= 999) {
                System.out.println("Yes");
            } else {
                System.out.println("No");
            }
        }
    }
}`
    }
  },

  "problem11": {
    id: "problem11",
    canonicalId: "voting-eligibility",
    title: "Voting Eligibility",
    stdin: "20",
    templates: {
      javascript: `// Problem 11: Voting Eligibility Checker
let age = 20;

if (age >= 18) {
    console.log("Eligible to Vote");
} else {
    console.log("Not Eligible to Vote");
}`,
      python: `# Problem 11: Voting Eligibility Checker
age = int(input())

if age >= 18:
    print("Eligible to Vote")
else:
    print("Not Eligible to Vote")`,
      cpp: `// Problem 11: Voting Eligibility Checker
#include <iostream>
using namespace std;

int main() {
    int age;
    if (cin >> age) {
        if (age >= 18) {
            cout << "Eligible to Vote" << endl;
        } else {
            cout << "Not Eligible to Vote" << endl;
        }
    }
    return 0;
}`,
      c: `// Problem 11: Voting Eligibility Checker
#include <stdio.h>

int main() {
    int age;
    if (scanf("%d", &age) == 1) {
        if (age >= 18) {
            printf("Eligible to Vote\\n");
        } else {
            printf("Not Eligible to Vote\\n");
        }
    }
    return 0;
}`,
      java: `// Problem 11: Voting Eligibility Checker
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        if (scanner.hasNextInt()) {
            int age = scanner.nextInt();
            if (age >= 18) {
                System.out.println("Eligible to Vote");
            } else {
                System.out.println("Not Eligible to Vote");
            }
        }
    }
}`
    }
  },

  "problem12": {
    id: "problem12",
    canonicalId: "pass-or-fail",
    title: "Pass or Fail",
    stdin: "45",
    templates: {
      javascript: `// Problem 12: Pass or Fail
let mark = 45;

if (mark >= 35) {
    console.log("Pass");
} else {
    console.log("Fail");
}`,
      python: `# Problem 12: Pass or Fail
mark = int(input())

if mark >= 35:
    print("Pass")
else:
    print("Fail")`,
      cpp: `// Problem 12: Pass or Fail
#include <iostream>
using namespace std;

int main() {
    int mark;
    if (cin >> mark) {
        if (mark >= 35) {
            cout << "Pass" << endl;
        } else {
            cout << "Fail" << endl;
        }
    }
    return 0;
}`,
      c: `// Problem 12: Pass or Fail
#include <stdio.h>

int main() {
    int mark;
    if (scanf("%d", &mark) == 1) {
        if (mark >= 35) {
            printf("Pass\\n");
        } else {
            printf("Fail\\n");
        }
    }
    return 0;
}`,
      java: `// Problem 12: Pass or Fail
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        if (scanner.hasNextInt()) {
            int mark = scanner.nextInt();
            if (mark >= 35) {
                System.out.println("Pass");
            } else {
                System.out.println("Fail");
            }
        }
    }
}`
    }
  },

  "problem13": {
    id: "problem13",
    canonicalId: "greater-than-100",
    title: "Greater than 100",
    stdin: "120",
    templates: {
      javascript: `// Problem 13: Greater than 100
let num = 120;

if (num > 100) {
    console.log("Greater than 100");
} else {
    console.log("Not Greater than 100");
}`,
      python: `# Problem 13: Greater than 100
num = int(input())

if num > 100:
    print("Greater than 100")
else:
    print("Not Greater than 100")`,
      cpp: `// Problem 13: Greater than 100
#include <iostream>
using namespace std;

int main() {
    int num;
    if (cin >> num) {
        if (num > 100) {
            cout << "Greater than 100" << endl;
        } else {
            cout << "Not Greater than 100" << endl;
        }
    }
    return 0;
}`,
      c: `// Problem 13: Greater than 100
#include <stdio.h>

int main() {
    int num;
    if (scanf("%d", &num) == 1) {
        if (num > 100) {
            printf("Greater than 100\\n");
        } else {
            printf("Not Greater than 100\\n");
        }
    }
    return 0;
}`,
      java: `// Problem 13: Greater than 100
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        if (scanner.hasNextInt()) {
            int num = scanner.nextInt();
            if (num > 100) {
                System.out.println("Greater than 100");
            } else {
                System.out.println("Not Greater than 100");
            }
        }
    }
}`
    }
  },

  "problem14": {
    id: "problem14",
    canonicalId: "profit-or-loss",
    title: "Profit or Loss",
    stdin: "100 150",
    templates: {
      javascript: `// Problem 14: Profit or Loss
let cp = 100;
let sp = 150;

if (sp > cp) {
    console.log("Profit: " + (sp - cp));
} else if (cp > sp) {
    console.log("Loss: " + (cp - sp));
} else {
    console.log("No Profit No Loss");
}`,
      python: `# Problem 14: Profit or Loss
inputs = input().split()
cp = float(inputs[0]) if len(inputs) > 0 else 100
sp = float(inputs[1]) if len(inputs) > 1 else 150

if sp > cp:
    print(f"Profit: {int(sp - cp)}")
elif cp > sp:
    print(f"Loss: {int(cp - sp)}")
else:
    print("No Profit No Loss")`,
      cpp: `// Problem 14: Profit or Loss
#include <iostream>
using namespace std;

int main() {
    double cp, sp;
    if (cin >> cp >> sp) {
        if (sp > cp) {
            cout << "Profit: " << (sp - cp) << endl;
        } else if (cp > sp) {
            cout << "Loss: " << (cp - sp) << endl;
        } else {
            cout << "No Profit No Loss" << endl;
        }
    }
    return 0;
}`,
      c: `// Problem 14: Profit or Loss
#include <stdio.h>

int main() {
    double cp, sp;
    if (scanf("%lf %lf", &cp, &sp) == 2) {
        if (sp > cp) {
            printf("Profit: %.0f\\n", (sp - cp));
        } else if (cp > sp) {
            printf("Loss: %.0f\\n", (cp - sp));
        } else {
            printf("No Profit No Loss\\n");
        }
    }
    return 0;
}`,
      java: `// Problem 14: Profit or Loss
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        if (scanner.hasNextDouble()) {
            double cp = scanner.nextDouble();
            double sp = scanner.hasNextDouble() ? scanner.nextDouble() : 150;
            if (sp > cp) {
                System.out.println("Profit: " + (int)(sp - cp));
            } else if (cp > sp) {
                System.out.println("Loss: " + (int)(cp - sp));
            } else {
                System.out.println("No Profit No Loss");
            }
        }
    }
}`
    }
  },

  "problem15": {
    id: "problem15",
    canonicalId: "leap-year",
    title: "Leap Year Checker",
    stdin: "2024",
    templates: {
      javascript: `// Problem 15: Leap Year Checker
let year = 2024;

if ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)) {
    console.log("Leap Year");
} else {
    console.log("Not a Leap Year");
}`,
      python: `# Problem 15: Leap Year Checker
year = int(input())

if (year % 4 == 0 and year % 100 != 0) or (year % 400 == 0):
    print("Leap Year")
else:
    print("Not a Leap Year")`,
      cpp: `// Problem 15: Leap Year Checker
#include <iostream>
using namespace std;

int main() {
    int year;
    if (cin >> year) {
        if ((year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)) {
            cout << "Leap Year" << endl;
        } else {
            cout << "Not a Leap Year" << endl;
        }
    }
    return 0;
}`,
      c: `// Problem 15: Leap Year Checker
#include <stdio.h>

int main() {
    int year;
    if (scanf("%d", &year) == 1) {
        if ((year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)) {
            printf("Leap Year\\n");
        } else {
            printf("Not a Leap Year\\n");
        }
    }
    return 0;
}`,
      java: `// Problem 15: Leap Year Checker
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        if (scanner.hasNextInt()) {
            int year = scanner.nextInt();
            if ((year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)) {
                System.out.println("Leap Year");
            } else {
                System.out.println("Not a Leap Year");
            }
        }
    }
}`
    }
  },

  "problem16": {
    id: "problem16",
    canonicalId: "adult-or-minor",
    title: "Adult or Minor",
    stdin: "20",
    templates: {
      javascript: `// Problem 16: Adult or Minor
let age = 20;

if (age >= 18) {
    console.log("Adult");
} else {
    console.log("Minor");
}`,
      python: `# Problem 16: Adult or Minor
age = int(input())

if age >= 18:
    print("Adult")
else:
    print("Minor")`,
      cpp: `// Problem 16: Adult or Minor
#include <iostream>
using namespace std;

int main() {
    int age;
    if (cin >> age) {
        if (age >= 18) {
            cout << "Adult" << endl;
        } else {
            cout << "Minor" << endl;
        }
    }
    return 0;
}`,
      c: `// Problem 16: Adult or Minor
#include <stdio.h>

int main() {
    int age;
    if (scanf("%d", &age) == 1) {
        if (age >= 18) {
            printf("Adult\\n");
        } else {
            printf("Minor\\n");
        }
    }
    return 0;
}`,
      java: `// Problem 16: Adult or Minor
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        if (scanner.hasNextInt()) {
            int age = scanner.nextInt();
            if (age >= 18) {
                System.out.println("Adult");
            } else {
                System.out.println("Minor");
            }
        }
    }
}`
    }
  },

  "problem17": {
    id: "problem17",
    canonicalId: "divisible-by-5",
    title: "Divisible by 5",
    stdin: "25",
    templates: {
      javascript: `// Problem 17: Divisible by 5
let n = 25;

if (n % 5 === 0) {
    console.log("Divisible by 5");
} else {
    console.log("Not Divisible by 5");
}`,
      python: `# Problem 17: Divisible by 5
n = int(input())

if n % 5 == 0:
    print("Divisible by 5")
else:
    print("Not Divisible by 5")`,
      cpp: `// Problem 17: Divisible by 5
#include <iostream>
using namespace std;

int main() {
    int n;
    if (cin >> n) {
        if (n % 5 == 0) {
            cout << "Divisible by 5" << endl;
        } else {
            cout << "Not Divisible by 5" << endl;
        }
    }
    return 0;
}`,
      c: `// Problem 17: Divisible by 5
#include <stdio.h>

int main() {
    int n;
    if (scanf("%d", &n) == 1) {
        if (n % 5 == 0) {
            printf("Divisible by 5\\n");
        } else {
            printf("Not Divisible by 5\\n");
        }
    }
    return 0;
}`,
      java: `// Problem 17: Divisible by 5
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        if (scanner.hasNextInt()) {
            int n = scanner.nextInt();
            if (n % 5 == 0) {
                System.out.println("Divisible by 5");
            } else {
                System.out.println("Not Divisible by 5");
            }
        }
    }
}`
    }
  },

  "problem18": {
    id: "problem18",
    canonicalId: "maximum-of-two",
    title: "Maximum of Two Numbers",
    stdin: "10 25",
    templates: {
      javascript: `// Problem 18: Maximum of Two Numbers
let a = 10;
let b = 25;

if (a > b) {
    console.log(a);
} else {
    console.log(b);
}`,
      python: `# Problem 18: Maximum of Two Numbers
inputs = input().split()
a = int(inputs[0]) if len(inputs) > 0 else 10
b = int(inputs[1]) if len(inputs) > 1 else 25

if a > b:
    print(a)
else:
    print(b)`,
      cpp: `// Problem 18: Maximum of Two Numbers
#include <iostream>
using namespace std;

int main() {
    int a, b;
    if (cin >> a >> b) {
        if (a > b) {
            cout << a << endl;
        } else {
            cout << b << endl;
        }
    }
    return 0;
}`,
      c: `// Problem 18: Maximum of Two Numbers
#include <stdio.h>

int main() {
    int a, b;
    if (scanf("%d %d", &a, &b) == 2) {
        if (a > b) {
            printf("%d\\n", a);
        } else {
            printf("%d\\n", b);
        }
    }
    return 0;
}`,
      java: `// Problem 18: Maximum of Two Numbers
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        if (scanner.hasNextInt()) {
            int a = scanner.nextInt();
            int b = scanner.hasNextInt() ? scanner.nextInt() : 25;
            if (a > b) {
                System.out.println(a);
            } else {
                System.out.println(b);
            }
        }
    }
}`
    }
  },

  "problem19": {
    id: "problem19",
    canonicalId: "senior-citizen",
    title: "Senior Citizen Checker",
    stdin: "65",
    templates: {
      javascript: `// Problem 19: Senior Citizen Checker
let age = 65;

if (age >= 60) {
    console.log("Senior Citizen");
} else {
    console.log("Not a Senior Citizen");
}`,
      python: `# Problem 19: Senior Citizen Checker
age = int(input())

if age >= 60:
    print("Senior Citizen")
else:
    print("Not a Senior Citizen")`,
      cpp: `// Problem 19: Senior Citizen Checker
#include <iostream>
using namespace std;

int main() {
    int age;
    if (cin >> age) {
        if (age >= 60) {
            cout << "Senior Citizen" << endl;
        } else {
            cout << "Not a Senior Citizen" << endl;
        }
    }
    return 0;
}`,
      c: `// Problem 19: Senior Citizen Checker
#include <stdio.h>

int main() {
    int age;
    if (scanf("%d", &age) == 1) {
        if (age >= 60) {
            printf("Senior Citizen\\n");
        } else {
            printf("Not a Senior Citizen\\n");
        }
    }
    return 0;
}`,
      java: `// Problem 19: Senior Citizen Checker
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        if (scanner.hasNextInt()) {
            int age = scanner.nextInt();
            if (age >= 60) {
                System.out.println("Senior Citizen");
            } else {
                System.out.println("Not a Senior Citizen");
            }
        }
    }
}`
    }
  },

  "problem20": {
    id: "problem20",
    canonicalId: "vowel-or-consonant",
    title: "Vowel or Consonant",
    stdin: "e",
    templates: {
      javascript: `// Problem 20: Vowel or Consonant
let ch = 'e'.toLowerCase();

if (ch === 'a' || ch === 'e' || ch === 'i' || ch === 'o' || ch === 'u') {
    console.log("Vowel");
} else {
    console.log("Consonant");
}`,
      python: `# Problem 20: Vowel or Consonant
ch = input().strip().lower()

if ch in ['a', 'e', 'i', 'o', 'u']:
    print("Vowel")
else:
    print("Consonant")`,
      cpp: `// Problem 20: Vowel or Consonant
#include <iostream>
#include <cctype>
using namespace std;

int main() {
    char ch;
    if (cin >> ch) {
        ch = tolower(ch);
        if (ch == 'a' || ch == 'e' || ch == 'i' || ch == 'o' || ch == 'u') {
            cout << "Vowel" << endl;
        } else {
            cout << "Consonant" << endl;
        }
    }
    return 0;
}`,
      c: `// Problem 20: Vowel or Consonant
#include <stdio.h>
#include <ctype.h>

int main() {
    char ch;
    if (scanf(" %c", &ch) == 1) {
        ch = tolower(ch);
        if (ch == 'a' || ch == 'e' || ch == 'i' || ch == 'o' || ch == 'u') {
            printf("Vowel\\n");
        } else {
            printf("Consonant\\n");
        }
    }
    return 0;
}`,
      java: `// Problem 20: Vowel or Consonant
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        if (scanner.hasNext()) {
            char ch = Character.toLowerCase(scanner.next().charAt(0));
            if (ch == 'a' || ch == 'e' || ch == 'i' || ch == 'o' || ch == 'u') {
                System.out.println("Vowel");
            } else {
                System.out.println("Consonant");
            }
        }
    }
}`
    }
  },

  "problem21": {
    id: "problem21",
    canonicalId: "multiplication-table",
    title: "Multiplication Table",
    stdin: "5",
    templates: {
      javascript: `// Problem 21: Multiplication Table
let n = 5;

for (let i = 1; i <= 10; i++) {
    console.log(n + " x " + i + " = " + (n * i));
}`,
      python: `# Problem 21: Multiplication Table
n = int(input())

for i in range(1, 11):
    print(f"{n} x {i} = {n * i}")`,
      cpp: `// Problem 21: Multiplication Table
#include <iostream>
using namespace std;

int main() {
    int n;
    if (cin >> n) {
        for (int i = 1; i <= 10; i++) {
            cout << n << " x " << i << " = " << (n * i) << endl;
        }
    }
    return 0;
}`,
      c: `// Problem 21: Multiplication Table
#include <stdio.h>

int main() {
    int n;
    if (scanf("%d", &n) == 1) {
        for (int i = 1; i <= 10; i++) {
            printf("%d x %d = %d\\n", n, i, n * i);
        }
    }
    return 0;
}`,
      java: `// Problem 21: Multiplication Table
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        if (scanner.hasNextInt()) {
            int n = scanner.nextInt();
            for (int i = 1; i <= 10; i++) {
                System.out.println(n + " x " + i + " = " + (n * i));
            }
        }
    }
}`
    }
  }
};

export function getProblemTemplates(rawId) {
  if (!rawId) return PROBLEM_TEMPLATES["problem01"];
  const cleanId = rawId.toString().toLowerCase().trim();

  // Direct match by problem01 ... problem21
  if (PROBLEM_TEMPLATES[cleanId]) return PROBLEM_TEMPLATES[cleanId];

  // Match problem1 -> problem01
  const m = cleanId.match(/^problem0?(\d+)$/);
  if (m) {
    const num = parseInt(m[1], 10);
    const key = `problem${num < 10 ? '0' + num : num}`;
    if (PROBLEM_TEMPLATES[key]) return PROBLEM_TEMPLATES[key];
  }

  // Match by canonicalId
  for (const item of Object.values(PROBLEM_TEMPLATES)) {
    if (item.canonicalId === cleanId) return item;
  }

  // Default fallback
  return PROBLEM_TEMPLATES["problem01"];
}
