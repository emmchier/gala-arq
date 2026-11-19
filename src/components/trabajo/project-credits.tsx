/**
 * Bloque de creditos de la ficha (spec §5.4).
 * Una linea por credito, con el patron `{rol} {valor}` y el rol omitido si
 * esta vacio. Si el valor empieza con @, linkea a Instagram.
 */
export function ProjectCredits({
  creditos,
}: {
  creditos:
    | Array<{ _key: string; rol?: string | null; valor?: string | null }>
    | null;
}) {
  if (!creditos?.length) return null;

  return (
    <div className="text-body text-quiet">
      {creditos.map((c) => {
        if (!c.valor) return null;
        const esHandle = c.valor.startsWith("@");
        return (
          <p key={c._key}>
            {c.rol ? `${c.rol} ` : ""}
            {esHandle ? (
              <a
                href={`https://instagram.com/${c.valor.slice(1)}`}
                target="_blank"
                rel="noreferrer noopener"
                className="transition-colors duration-fast ease-site hover:text-ink"
              >
                {c.valor}
              </a>
            ) : (
              c.valor
            )}
          </p>
        );
      })}
    </div>
  );
}
