interface AccountCardProps {
  account: {
    features: string;
    // Add other account properties as needed
  };
}

export default function AccountCard({ account }: AccountCardProps) {
  return (
    <ul>
      {(() => {
        const parsedFeatures = JSON.parse(account.features as string) as string[];
        return parsedFeatures.map((feature: string, index: number) => (
          <li key={index}>• {feature}</li>
        ));
      })()}
    </ul>
  );
} 