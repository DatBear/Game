using System.Drawing;
using NetCoreGameServer.Data.Model;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace NetCoreGameServer.Service;

public class MazeGenerator
{
    private static readonly Random r = new();

    public static Maze Generate(int size)
    {
        var cells = new Cell[size][];
        for (var X = 0; X < size; X++)
        {
            cells[X] = Enumerable.Range(0, size).Select((_, y) => new Cell
            {
                Walls = Direction.North | Direction.East | Direction.South | Direction.West,
                Visited = false,
                X = y,
                Y = X
            }).ToArray();
        }

        Stack<Cell> stack = new Stack<Cell>();
        var x = r.Next(size);
        var y = r.Next(size);
        var first = cells[y][x];
        first.Visited = true;
        stack.Push(first);

        while (stack.Count > 0)
        {
            var current = stack.Pop();
            if (current == null) break;

            var neighbors = GetNeighbors(current, cells);
            if (neighbors.Length > 0)
            {
                var neighbor = neighbors[r.Next(neighbors.Length-1)];
                stack.Push(current);
                if (neighbor.X > current.X)
                {
                    neighbor.Walls &= ~Direction.West;
                    current.Walls &= ~Direction.East;
                }
                else if (neighbor.X < current.X)
                {
                    neighbor.Walls &= ~Direction.East;
                    current.Walls &= ~Direction.West;
                }
                else if (neighbor.Y > current.Y)
                {
                    neighbor.Walls &= ~Direction.North;
                    current.Walls &= ~Direction.South;
                }
                else if (neighbor.Y < current.Y)
                {
                    neighbor.Walls &= ~Direction.South;
                    current.Walls &= ~Direction.North;
                }

                neighbor.Visited = true;
                stack.Push(neighbor);
            }
        }

        for (var x2 = 0; x2 < cells.Length; x2++)
        {
            for (var y2 = 0; y2 < cells[x2].Length; y2++)
            {
                cells[y2][x2].Visited = false;
            }
        }
        
        var position = new Position
        {
            X = r.Next(size - 1),
            Y = r.Next(size - 1),
            Direction = Direction.North
        };
        cells[position.Y][position.X].Visited = true;

        return new Maze
        {
            Cells = cells,
            Position = position
        };
    }

    private static Cell[] GetNeighbors(Cell cell, Cell[][] maze)
    {
        var x = cell.X;
        var y = cell.Y;
        var neighbors = new List<Cell>();
        if (x > 0) neighbors.Add(maze[y][x - 1]);
        if (x < maze[0].Length - 1) neighbors.Add(maze[y][x + 1]);
        if (y > 0) neighbors.Add(maze[y - 1][x]);
        if (y < maze.Length - 1) neighbors.Add(maze[y + 1][x]);
        return neighbors.Where(c => !c.Visited).ToArray();
    }
}