import DarkLayout from '../layouts/DarkLayout';

export default function DeliveryPage() {
  return (
    <DarkLayout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-black/40 z-10" />
          <div className="relative z-20 text-center">
            <h1 className="text-6xl font-bold mb-6">Livraison & Paiement</h1>
            <p className="text-2xl text-white/90">
              Un processus simple et sécurisé
            </p>
          </div>
        </section>

        {/* Contenu principal */}
        <section className="py-24">
          <div className="max-w-4xl mx-auto px-4">
            {/* Méthodes de paiement */}
            <div className="mb-16">
              <h2 className="text-4xl font-bold mb-8 text-center hover:text-blue-500 transition-colors">
                Moyens de Paiement Acceptés
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-black/40 p-6 rounded-xl hover:bg-white/5 transition-all">
                  <h3 className="text-xl font-bold mb-4 text-blue-500">PayPal</h3>
                  <p className="text-white/80">
                    Paiement sécurisé avec protection acheteur
                  </p>
                </div>
                <div className="bg-black/40 p-6 rounded-xl hover:bg-white/5 transition-all">
                  <h3 className="text-xl font-bold mb-4 text-blue-500">
                    Virement Bancaire
                  </h3>
                  <p className="text-white/80">
                    Transfert direct sur notre compte professionnel
                  </p>
                </div>
                <div className="bg-black/40 p-6 rounded-xl hover:bg-white/5 transition-all">
                  <h3 className="text-xl font-bold mb-4 text-blue-500">Crypto</h3>
                  <p className="text-white/80">
                    Bitcoin, Ethereum et autres cryptomonnaies
                  </p>
                </div>
              </div>
            </div>

            {/* Processus de livraison */}
            <div>
              <h2 className="text-4xl font-bold mb-8 text-center hover:text-blue-500 transition-colors">
                Processus de Livraison
              </h2>
              <div className="space-y-6">
                <div className="bg-black/40 p-8 rounded-xl hover:bg-white/5 transition-all">
                  <h3 className="text-2xl font-bold mb-4">1. Confirmation</h3>
                  <p className="text-white/80">
                    Après réception de votre paiement, nous confirmons
                    immédiatement la transaction via Discord ou Telegram.
                  </p>
                </div>

                <div className="bg-black/40 p-8 rounded-xl hover:bg-white/5 transition-all">
                  <h3 className="text-2xl font-bold mb-4">2. Transfert</h3>
                  <p className="text-white/80">
                    Nous procédons au transfert des identifiants du compte en
                    toute sécurité via un canal de communication chiffré.
                  </p>
                </div>

                <div className="bg-black/40 p-8 rounded-xl hover:bg-white/5 transition-all">
                  <h3 className="text-2xl font-bold mb-4">3. Vérification</h3>
                  <p className="text-white/80">
                    Nous vous assistons dans la connexion et la vérification du
                    compte, ainsi que dans le changement des accès.
                  </p>
                </div>

                <div className="bg-black/40 p-8 rounded-xl hover:bg-white/5 transition-all">
                  <h3 className="text-2xl font-bold mb-4">4. Support</h3>
                  <p className="text-white/80">
                    Notre équipe reste disponible 24/7 pour vous accompagner après
                    la livraison.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </DarkLayout>
  );
}
