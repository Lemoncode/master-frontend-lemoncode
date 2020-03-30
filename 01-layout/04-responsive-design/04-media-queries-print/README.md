# Module 1 - Layout

# Media queries print

## Steps:

### 1. Create a basic HTML. This is the starting point for demo.

```html
<body>
  <style>
    body {
      width: 90%;
      margin: 0 auto;
    }

    table {
      font-family: monospace;
      border-collapse: collapse;
      width: 100%;
    }

    td,
    th {
      border: 1px solid #000000;
      text-align: center;
      padding: 1em;
    }

    tr {
      min-height: 300px;
    }

    tr:nth-of-type(2n + 1) {
      background-color: #bbbbbb;
    }
  </style>
  <table>
    <thead>
      <tr>
        <th>Artist</th>
        <th>Album</th>
        <th>Sales</th>
      </tr>
    </thead>
    <tbody></tbody>
  </table>
</body>
```

- Get a view of starting point

### 2. We are going to apply some media queries to modify the results on print.

- Place scripts on body bottom.

```javascript
<script type="text/javascript">
    document.addEventListener('DOMContentLoaded', function () {
        var artistCellGenerator = function (index, artistCell) {
            var artistText = document.createTextNode('Joe Doe' + index);
            artistCell.appendChild(artistText);
        };

        var albumCellGenerator = function (index, albumCell) {
            var albumText = document.createTextNode('Foo is back' + index)
            albumCell.appendChild(albumText);
        };

        var salesCellGenerator = function (index, salesCell) {
            var salesText = document.createTextNode(index);
            salesCell.appendChild(salesText);
        };

        var generateTable = function (numberOfRows) {
            var table = document.querySelector('table tbody');
            for (var index = 0; index < numberOfRows; index++) {
                var newRow = table.insertRow(index);
                artistCellGenerator(index, newRow.insertCell(0));
                albumCellGenerator(index, newRow.insertCell(0));
                salesCellGenerator(index, newRow.insertCell(0));
            }
        };

        generateTable(150);
    });
</script>
```

- Show results. Print document on browser-

### 3. Now we are going to use a media query to solve the problem that rows showing cut.

```diff styles
+@media print {
+        table {
+          page-break-inside: auto;
+        }
+
+        tr {
+          page-break-inside: avoid;
+          page-break-after: auto;
+        }
+
+        @page{  size: landscape; }
+      }
```
