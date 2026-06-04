import { BOOKING_SERVICES } from '../lib/constants'

export default function PanelListToolbar({ search, onSearchChange, serviceFilter, onServiceFilterChange }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <input
        type="search"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Buscar nome, telefone ou serviço..."
        className="input-luxury flex-1"
        aria-label="Buscar agendamentos"
      />
      <select
        value={serviceFilter}
        onChange={(e) => onServiceFilterChange(e.target.value)}
        className="input-luxury sm:max-w-[200px]"
        aria-label="Filtrar por serviço"
      >
        <option value="">Todos os serviços</option>
        {BOOKING_SERVICES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    </div>
  )
}
