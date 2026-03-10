import React, { useState, useEffect, useRef } from 'react';
import { MicrophoneIcon, PaperAirplaneIcon, XIcon } from '@heroicons/react/solid';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatbotFAB() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [greetedOnce, setGreetedOnce] = useState(false);
  const [rateLimitMsg, setRateLimitMsg] = useState('');
  const [productsInfo, setProductsInfo] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [quickOptions, setQuickOptions] = useState([]);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const quickOptionLockRef = useRef(false);

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const defaultQuickOptions = [
    {
      id: 'search',
      label: 'Buscar productos',
      prompt: 'Quiero encontrar productos según mi estilo y presupuesto. ¿Qué me recomiendas?',
      icon: '🔍',
    },
    {
      id: 'offers',
      label: 'Ver ofertas',
      prompt: 'Muéstrame las mejores ofertas disponibles ahora mismo.',
      icon: '⚡',
    },
    {
      id: 'order',
      label: 'Estado de pedido',
      prompt: 'Necesito ayuda con el estado de mi pedido. ¿Qué datos necesitas?',
      icon: '📦',
    },
  ];

  const config = {
    voiceLang: 'es-ES',
    voiceRate: 0.95,
    voicePitch: 0.8,
    speakReplies: true,
    model: 'openai/gpt-4o-mini',
    historyLimit: 10,
  };

  const rateLimitRef = useRef({
    maxRequests: 10,
    timeWindow: 60000,
    requests: [],
    isLimited() {
      const now = Date.now();
      this.requests = this.requests.filter((time) => now - time < this.timeWindow);
      if (this.requests.length >= this.maxRequests) return true;
      this.requests.push(now);
      return false;
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch('/api/chat/products-info');
        if (response.ok) {
          const data = await response.json();
          setProductsInfo(data);
        }
      } catch (error) {
        console.error('Error loading products:', error);
      }
    };
    loadProducts();
  }, []);

  useEffect(() => {
    if (open && !greetedOnce) {
      setGreetedOnce(true);
      setQuickOptions(defaultQuickOptions);
      setShowSuggestions(true);
      setTimeout(() => {
        addBotMessage('¡Hola! Soy tu asistente de RudiSmartShop. ¿En qué puedo ayudarte?');
      }, 250);
    }
  }, [open, greetedOnce]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const rec = new SpeechRecognition();
    rec.lang = config.voiceLang;
    rec.continuous = false;
    rec.interimResults = false;

    rec.onresult = (e) => {
      let text = '';
      for (let i = e.resultIndex; i < e.results.length; i += 1) {
        text += e.results[i][0].transcript;
      }
      setInput(text);
    };

    recognitionRef.current = rec;
  }, []);

  const speakText = (text) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const cleanText = text
      .replace(/[*_~`]/g, '')
      .replace(/[\u{1F300}-\u{1F9FF}]/gu, '')
      .replace(/[\u{2600}-\u{26FF}]/gu, '')
      .replace(/[\u{2700}-\u{27BF}]/gu, '')
      .replace(/\s+/g, ' ')
      .trim();

    const utt = new SpeechSynthesisUtterance(cleanText);
    utt.lang = config.voiceLang;
    utt.rate = config.voiceRate;
    utt.pitch = config.voicePitch;

    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) utt.voice = voices[0];

    window.speechSynthesis.speak(utt);
  };

  const addBotMessage = (content) => {
    setMessages((prev) => [...prev, { role: 'bot', content }]);
  };

  const buildInventoryReply = (text) => {
    if (!productsInfo) return null;

    const normalizedText = text.toLowerCase();
    const asksTotalProducts = /(cu[aá]nt[oa]s?|cantidad|total).*(productos|art[ií]culos|items?)/i.test(normalizedText)
      || /(productos|art[ií]culos|items?).*(cu[aá]nt[oa]s?|cantidad|total)/i.test(normalizedText);
    const asksStock = /(stock|inventario|existencias|unidades disponibles|disponibilidad)/i.test(normalizedText);

    if (!asksTotalProducts && !asksStock) return null;

    const totalProducts = productsInfo.totalProducts ?? 0;
    const availableProducts = productsInfo.availableProducts ?? totalProducts;
    const totalStock = productsInfo.totalStock;
    const categoriesCount = Array.isArray(productsInfo.categories) ? productsInfo.categories.length : 0;

    let reply = `Ahora mismo tenemos ${totalProducts} productos en total y ${availableProducts} disponibles para compra.`;
    if (typeof totalStock === 'number') {
      reply += ` En inventario suman ${totalStock} unidades.`;
    }
    if (categoriesCount > 0) {
      reply += ` Están distribuidos en ${categoriesCount} categorías.`;
    }

    return `${reply}\n\n¿Quieres que te muestre las ofertas con mejor descuento?`;
  };

  const handleSendMessage = async (text = input) => {
    if (!text.trim()) return;

    if (rateLimitRef.current.isLimited()) {
      setRateLimitMsg('⏱️ Estás enviando muchos mensajes. Espera un minuto.');
      setTimeout(() => setRateLimitMsg(''), 3000);
      return;
    }

    if (text.length > 1000) {
      addBotMessage('❌ Tu mensaje es muy largo (máximo 1000 caracteres).');
      return;
    }

    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setInput('');

    const inventoryReply = buildInventoryReply(text);
    if (inventoryReply) {
      addBotMessage(inventoryReply);
      if (config.speakReplies) {
        speakText(inventoryReply);
      }
      return;
    }

    setLoading(true);

    try {
      let productContext = '';
      if (productsInfo) {
        const categoryList = Array.isArray(productsInfo.categories)
          ? productsInfo.categories.join(', ')
          : '';
        const inventorySummary = `Total productos: ${productsInfo.totalProducts ?? 0} | Disponibles: ${productsInfo.availableProducts ?? 0} | Stock total: ${productsInfo.totalStock ?? 0} unidades`;
        productContext = `\n\nCATÁLOGO DE PRODUCTOS:\n${inventorySummary}\nCategorías: ${categoryList}.\n\n`;

        for (const [category, products] of Object.entries(productsInfo.productsByCategory)) {
          if (products.length > 0) {
            productContext += `${category.toUpperCase()}:\n`;
            products.slice(0, 5).forEach((p) => {
              const stockInfo = p.stock !== undefined ? ` | Stock: ${p.stock} unidades` : '';
              const discountInfo = p.discount && p.discount > 0 ? ` | ${p.discount}% OFF` : '';
              const priceInfo = p.originalPrice && p.discount ? `${p.originalPrice} → ${p.price} dólares` : `${p.price} dólares`;
              productContext += `- ${p.name}: ${priceInfo}${discountInfo}${p.sale ? ' (EN OFERTA)' : ''}${
                p.newArival ? ' (NUEVO)' : ''
              }${stockInfo}\n`;
            });
            productContext += '\n';
          }
        }
      }

      const systemPrompt = `Eres RudiBot, un asesor de compras AMIGABLE y profesional de RudiSmartShop.

PERSONALIDAD - CÓMO DEBES SER:
- Siempre cordial, cercano y natural (como un vendedor experto real)
- Haz chistes ligeros si viene al caso, pero mantén profesionalismo
- Si algo no está disponible, sugiere alternativas sin ser aburrido
- Celebra las decisiones del cliente ("Excelente elección!" "Perfecto!")
- Convierte información aburrida en conversación interesante

USO DE EMOJIS - SOLO CUANDO SUMA:
Usa UN emoji máximo por respuesta en estos casos:
👕 Cuando hablas de productos específicos (ropa/accesorios)
⚡ Para destacar ofertas increíbles (30%, 40% OFF)
💚 Cuando das una recomendación personal que te gusta
✨ Para nuevos productos o sorpresas
❌ Si algo está agotado (pero ofrece alternativa positiva)
📦 Para preguntas de envío/pedidos
😊 Al saludar o cerrar amistosamente
NO USES emojis si la pregunta es técnica o seria

FORMATO PARA LISTAS DE PRODUCTOS:
Cuando listes 2+ productos, usa:
1. Nombre Producto: $XX (Descuento% OFF - antes $XX) - Stock unidades
2. Otro Producto: $XX - Stock unidades
(CADA PRODUCTO EN LÍNEA NUEVA)

REGLAS IMPORTANTES:
- Stock < 5 = "últimas unidades disponibles"
- Stock = 0 = NO lo menciones, ofrece alternativa
- Precios siempre en dólares: "$15" o "15 dólares"
- Respuestas cortas pero cálidas (máximo 5-6 líneas)
- Termina cada respuesta con una pregunta genuina${productContext}`;

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: config.model,
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages
              .filter((_, idx) => idx >= Math.max(0, messages.length - config.historyLimit))
              .map((m) => ({ role: m.role === 'bot' ? 'assistant' : 'user', content: m.content })),
            { role: 'user', content: text },
          ],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          addBotMessage('🚫 Demasiadas solicitudes. El servidor está protegido contra spam. Intenta en unos minutos.');
        } else if (response.status === 504) {
          addBotMessage('⏱️ La solicitud tardó demasiado. Intenta de nuevo.');
        } else {
          addBotMessage(data?.error?.message || '❌ Error en la solicitud');
        }
        setLoading(false);
        return;
      }

      const reply = data?.choices?.[0]?.message?.content || '❌ No pude responder';
      setLoading(false);
      await wait(280);
      addBotMessage(reply);

      if (config.speakReplies) {
        speakText(reply);
      }
    } catch (error) {
      console.error('Bot error:', error);
      setLoading(false);
      addBotMessage('❌ Error de conexión. Verifica tu internet e intenta de nuevo.');
    }
  };

  const toggleMic = () => {
    if (!recognitionRef.current) return;
    if (recognitionRef.current.running) {
      recognitionRef.current.abort();
    } else {
      setInput('');
      recognitionRef.current.start();
    }
  };

  const handleCloseChat = () => {
    setOpen(false);
    setMessages([]);
    setGreetedOnce(false);
    setShowSuggestions(false);
    setQuickOptions([]);
  };

  const handleQuickOption = async (option) => {
    if (loading || quickOptionLockRef.current) return;
    quickOptionLockRef.current = true;
    try {
      await handleSendMessage(option.prompt);
    } finally {
      quickOptionLockRef.current = false;
    }
  };

  const greetingIndex = messages.findIndex(
    (msg) => msg.role === 'bot' && msg.content?.includes('¡Hola! Soy tu asistente de RudiSmartShop')
  );
  const firstBotIndex = messages.findIndex((msg) => msg.role === 'bot');
  const suggestionsAnchorIndex = greetingIndex !== -1 ? greetingIndex : firstBotIndex;

  return (
    <>
      {/* Botón flotante visible solo cuando el chat está cerrado */}
      <AnimatePresence>
        {!open && (
          <motion.button
            onClick={() => setOpen(true)}
            title="Abrir RudiBot"
            className="fixed bottom-8 right-6 z-50 flex items-center justify-center overflow-hidden rounded-2xl bg-gray-900 shadow-2xl"
            style={{ width: 88, height: 88 }}
            whileHover={{ scale: 1.08, boxShadow: '0 15px 50px rgba(99, 102, 241, 0.35)' }}
            whileTap={{ scale: 0.94 }}
            initial={{ opacity: 0, scale: 0.85, y: 0 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              y: [0, -8, 0]
            }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ 
              opacity: { duration: 0.18 },
              scale: { duration: 0.18 },
              y: { 
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
          >
            <motion.img
              key="bot-icon"
              src="/holis-removebg-preview.png"
              alt="Holis"
              className="h-[74%] w-[74%] object-contain"
              initial={{ scale: 0.8, rotate: -45, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ type: 'spring', damping: 18, stiffness: 260 }}
            />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Ventana del chat con Spring Animation */}
      <AnimatePresence>
        {open && (
          <div className="fixed right-6 bottom-28 z-40">
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 30 }}
              transition={{ type: 'spring', damping: 24, stiffness: 280 }}
              className="flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-black/60 backdrop-blur-md text-white shadow-lg"
              style={{ width: 380, height: 580 }}
            >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 bg-black/60 backdrop-blur-md p-4">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src="/holis-removebg-preview.png"
                alt="Holis"
                className="h-10 w-10 rounded-full object-contain flex-shrink-0"
              />
              <div className="flex items-center gap-2 min-w-0">
                <h3 className="text-lg font-bold text-white truncate">RudiBot</h3>
                <span className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse" />
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto bg-black/60 backdrop-blur-md p-4">
            {messages.length === 0 && !greetedOnce && (
              <div className="text-sm text-gray-400">Inicia una conversación...</div>
            )}

            {messages.map((msg, idx) => (
              <React.Fragment key={`${msg.role}-${idx}`}>
                <motion.div
                  className={msg.role === 'user' ? 'flex justify-end' : 'flex justify-start'}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    type: 'spring',
                    damping: 25,
                    stiffness: 300
                  }}
                >
                  {msg.role === 'bot' && (
                    <img
                      src="/holis-removebg-preview.png"
                      alt="Holis"
                      className="mr-2 mt-1 h-6 w-6 rounded-full object-contain flex-shrink-0"
                    />
                  )}
                  <div
                    style={{ maxWidth: '78%' }}
                    className={`rounded-2xl py-3 px-4 text-sm leading-relaxed whitespace-pre-wrap ${
                      msg.role === 'user' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-black/60 backdrop-blur-md border border-white/10 text-gray-100 shadow-lg'
                    }`}
                  >
                    {msg.content}
                  </div>
                </motion.div>

                {showSuggestions && quickOptions.length > 0 && idx === suggestionsAnchorIndex && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="w-full pt-3"
                  >
                    <div className="flex w-full flex-col items-start gap-1.5">
                      {quickOptions.map((option, optionIdx) => (
                        <motion.button
                          key={option.id}
                          onClick={() => handleQuickOption(option)}
                          disabled={loading}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -8 }}
                          transition={{ duration: 0.2, delay: optionIdx * 0.05 }}
                          whileHover={{ x: 2 }}
                          whileTap={{ scale: 0.98 }}
                          className={`group flex items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs font-medium transition-all duration-300 before:content-['│'] before:text-white/25 before:mr-1.5 ${
                            loading
                              ? 'cursor-not-allowed opacity-50 text-neutral-500'
                              : 'text-neutral-300 hover:text-white hover:bg-white/5 active:text-white'
                          }`}
                        >
                          <span className="text-sm transition-transform group-hover:scale-110">
                            {option.icon}
                          </span>
                          <span>{option.label}</span>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </React.Fragment>
            ))}

            {loading && (
              <div className="flex justify-start">
                <img
                  src="/holis-removebg-preview.png"
                  alt="Holis"
                  className="mr-2 mt-1 h-6 w-6 rounded-full object-contain flex-shrink-0"
                />
                <div style={{ maxWidth: '78%' }} className="rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 px-4 py-3 text-sm text-gray-300 shadow-lg">respondiendo...</div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {rateLimitMsg && <div className="px-4 pb-2 text-xs text-amber-300">{rateLimitMsg}</div>}

          <div className="bg-black/60 backdrop-blur-md border-t border-white/10 p-4 pt-2">
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/60 backdrop-blur-md px-2 py-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Escribe un mensaje..."
                className="flex-1 bg-transparent px-2 text-sm text-white placeholder-gray-400 focus:outline-none"
                disabled={loading}
              />

              <button
                onClick={toggleMic}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/60 backdrop-blur-md text-white transition-colors hover:bg-black/70 border border-white/10"
                title="Usar micrófono"
              >
                <MicrophoneIcon className="h-4 w-4" />
              </button>

              <button
                onClick={() => handleSendMessage()}
                disabled={loading || !input.trim()}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-black/70 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-white/10"
                title="Enviar mensaje"
              >
                <PaperAirplaneIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
            </motion.div>

            <motion.button
              onClick={handleCloseChat}
              className="absolute -bottom-20 right-0 inline-flex h-14 w-14 items-center justify-center rounded-lg bg-black/60 backdrop-blur-md text-white transition-colors hover:bg-black/70 border border-white/10"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              title="Cerrar chat"
            >
              <XIcon className="h-5 w-5" />
            </motion.button>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
