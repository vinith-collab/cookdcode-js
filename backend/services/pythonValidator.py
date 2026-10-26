import ast
import sys

def check_code(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            src = f.read()
        tree = ast.parse(src)
        for node in ast.walk(tree):
            if isinstance(node, ast.Attribute) and isinstance(node.value, ast.Name) and node.value.id == 'console':
                print(f"Line {node.lineno}: NameError: name 'console' is not defined. (In Python, use print() instead)", file=sys.stderr)
                return 1
            if isinstance(node, ast.Name) and node.id in ['var', 'let', 'const']:
                print(f"Line {node.lineno}: SyntaxError: '{node.id}' is not valid Python syntax", file=sys.stderr)
                return 1
        return 0
    except SyntaxError as e:
        print(f"Line {e.lineno}, col {e.offset}: SyntaxError: {e.msg}", file=sys.stderr)
        return 1
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        return 1

if __name__ == '__main__':
    if len(sys.argv) > 1:
        sys.exit(check_code(sys.argv[1]))
    sys.exit(0)
