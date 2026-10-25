export function CyberTable({
  headers,
  data,
  sortConfig,
  onSort,
}: {
  headers: string[]
  data: any[]
  sortConfig?: { key: string; direction: 'asc' | 'desc' } | null
  onSort?: (key: string) => void
}) {
  return (
    <div className="overflow-x-auto rounded-md border border-white/10 bg-black/40 backdrop-blur-xl">
      <table className="w-full min-w-full divide-y divide-white/10 font-mono text-sm">
        <thead className="bg-white/5">
          <tr>
            {headers.map((header, idx) => (
              <th
                key={idx}
                className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer select-none ${onSort ? 'hover:bg-cyan-500/10 hover:text-cyan-400' : ''}`}
                onClick={() => onSort && onSort(header)}
              >
                <div className="flex items-center gap-2">
                  {header}
                  {sortConfig?.key === header && (
                    <span className="text-cyan-400">
                      {sortConfig?.direction === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-white/5">
              {headers.map((header, colIndex) => (
                <td key={`${rowIndex}-${colIndex}`} className="px-4 py-3 whitespace-nowrap text-gray-300">
                  {row[header] !== undefined && row[header] !== null ? row[header] : '-'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
