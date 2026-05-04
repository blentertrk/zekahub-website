import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import ZekaHubNedir from '@/components/ZekaHubNedir'
import Hizmetler from '@/components/Hizmetler'
import DigitalMarketing from '@/components/DigitalMarketing'
import SesPaketleri from '@/components/SesPaketleri'
import AbonelikPaketleri from '@/components/AbonelikPaketleri'
import CallAutomation from '@/components/CallAutomation'
import Sektorler from '@/components/Sektorler'
import CokDilli from '@/components/CokDilli'
import Altyapi from '@/components/Altyapi'
import Iletisim from '@/components/Iletisim'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ZekaHubNedir />
        <Hizmetler />
        <DigitalMarketing />
        <SesPaketleri />
        <AbonelikPaketleri />
        <CallAutomation />
        <Sektorler />
        <CokDilli />
        <Altyapi />
        <Iletisim />
      </main>
      <Footer />
    </>
  )
}
