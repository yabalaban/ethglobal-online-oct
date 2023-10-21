function Name({ name }: { name: string }) {
  return (
    <>
      <div className="mb-4">
        <h1 className="text-4xl font-medium">{name}</h1>
      </div>
    </>
  );
}

function Description({ description }: { description: string }) {
  return (
    <>
      <div>
        <div className="mb-6 dark:text-white/[80%]">
          <p className="text-sm break-words">{description}</p>
        </div>
      </div>
    </>
  );
}

export function Details({ details }: { details: { name: string; description: string } }) {
  return (
    <>
      <Name name={details.name} />
      <Description description={details.description} />
    </>
  );
}
