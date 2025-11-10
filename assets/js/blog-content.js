// This is your blog post "database"
// We use a Map for easy lookups by a string key (the "slug")

const blogPosts = new Map();

blogPosts.set("mixing-tips", {
  title: "5 Mixing Tips for a Wider Stereo Image",
  author: "Alex Chen",
  date: "Nov 8, 2025",
  category: "Production",
  image: "assets/images/blog-image-1.jpg",
  content: `
    <p class="lead">Getting your mix to sound wide and spacious is a common goal for producers. A wide mix feels more immersive and professional. Here are five essential tips to help you expand your stereo image without causing phase issues.</p>
    
    <h4>1. Smart Panning</h4>
    <p>Don't just pan things hard left, center, and hard right. Use the entire stereo field. Try panning rhythm guitars at 80% L/R, and maybe a hi-hat at 15% R. This "inside" panning creates space for the main elements.</p>
    
    <h4>2. Use Haas Effect (With Caution)</h4>
    <p>Duplicate a mono track (like a vocal), pan one hard left and the other hard right. On one of the tracks, add a very short delay (5-15ms). This will trick the listener's ear into hearing one, unified, and very wide sound. Be careful to check your mix in mono for phase cancellation!</p>
    
    <h4>3. EQ in Mid/Side Mode</h4>
    <p>Use an EQ that supports Mid/Side processing. On your master bus (or a subgroup), you can gently boost the high frequencies (8kHz+) on the "Side" channel. This adds "air" and width to the edges of your mix, making it feel wider.</p>

    <h4>4. Stereo Reverb & Delay</h4>
    <p>Use stereo delays (like a ping-pong delay) on lead elements to make them bounce between speakers. For reverb, try using a short, wide "room" reverb on your drum bus to give them a sense of space, and a longer, lush "hall" reverb on vocals or synths.</p>

    <h4>5. Create Contrast</h4>
    <p>Your mix will only sound wide if some elements are narrow. Keep your kick drum, bass, and lead vocal locked in the center (mono). This provides a solid anchor and makes the panned elements (guitars, synths, percussion) feel even wider in comparison.</p>
  `,
});

blogPosts.set("mic-placement", {
  title: "The Beginner's Guide to Mic Placement",
  author: "Marcus Cole",
  date: "Nov 5, 2025",
  category: "Recording",
  image: "assets/images/studio-a.jpg",
  content: `
    <p class="lead">Getting a good sound starts at the source. Before you reach for an EQ, let's look at the fundamentals of microphone placement for a few common instruments.</p>
    
    <h4>Acoustic Guitar</h4>
    <p>A classic technique is to use a small-diaphragm condenser microphone pointing at the 12th fret, about 6-12 inches away. This captures the clear articulation of the strings without the booming sound from the soundhole.</p>
    
    <h4>Vocals</h4>
    <p>For most pop and rock vocals, use a large-diaphragm condenser. Place it 6-10 inches from the vocalist, with a pop filter in between. The height should be level with their mouth. If you get too close, the "proximity effect" will add a lot of bass (which may or may not be what you want!).</p>

    <h4>Drum Kit (Simple Setup)</h4>
    <p>If you only have a few mics, try the 'Glyn Johns' method. Place one mic overhead, one on the side of the kit focused on the snare, and one in the kick drum. This can give you a surprisingly full and natural drum sound.</p>
  `,
});

blogPosts.set("artist-spotlight-nightcaps", {
  title: "Inside the Session: The Making of 'Sunset Drive'",
  author: "Jenna Riley",
  date: "Nov 2, 2025",
  category: "Artist Spotlight",
  image: "assets/images/blog-image-3.jpg",
  content: `
    <p class="lead">We sat down with local funk band 'The Nightcaps' to discuss their workflow for their latest single, 'Sunset Drive,' recorded right here in Studio B.</p>
    
    <p>"The main thing for us is the live feel," says lead singer, Maria. "We tracked the drums, bass, and rhythm guitar all at once in The Live Room. You just can't fake that energy."</p>
    
    <h4>Finding the Tone</h4>
    <p>The band spent the first four hours just dialing in tones, using our vintage Ampeg bass amp and the Marshall guitar stack. "Having that gear available meant we got the sound we heard in our heads, right at the source," notes guitarist, Sam.</p>

    <p>The track, a tight, 3-minute funk instrumental, was recorded to analog tape before being transferred to Pro Tools for overdubs and mixing. "It's the best of both worlds," says Alex Chen, who engineered the session. "The warmth of tape, with the editing flexibility of digital."</p>
  `,
});
