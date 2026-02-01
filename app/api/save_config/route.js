import { MongoClient, ServerApiVersion } from "mongodb"

const client = new MongoClient(process.env.DB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
})

/**
 * Converte números em strings para números reais
 */
function parseValue(value) {
    // Se for array, processa cada item
    if (Array.isArray(value)) {
        return value.map(parseValue);
    }
    // Se for string vazia, retorna undefined
    if (typeof value === 'string' && value === '') {
        return undefined;
    }
    // Se for string numérica, converte para número, exceto se for id de canal/role (mantém string)
    // IDs do Discord são strings longas, normalmente >= 17 dígitos
    if (typeof value === 'string' && !isNaN(value)) {
        // Se for string só de dígitos e tiver 17 ou mais caracteres, provavelmente é um id do Discord
        if (/^\d{17,}$/.test(value)) {
            return value;
        }
        return Number(value);
    }
    return value;
}

/**
 * Constrói o objeto de update usando dot notation
 */
function buildUpdateQuery(config) {
  const updates = {};
  
  for (const [key, value] of Object.entries(config)) {
    let parsedValue = parseValue(value);
    
    // Garante que campos de múltiplos canais sempre sejam arrays de string
        if ((key === 'channels.actions' || key === 'channels.events') && value !== null && value !== undefined) {
            if (Array.isArray(parsedValue)) {
                parsedValue = parsedValue.map(String);
            } else if (typeof parsedValue === 'string' && parsedValue.trim() !== '') {
                // Tenta parsear como JSON array
                try {
                    const arr = JSON.parse(parsedValue);
                    if (Array.isArray(arr)) {
                        parsedValue = arr.map(String);
                    } else if (arr !== undefined && arr !== null) {
                        parsedValue = [String(arr)];
                    }
                } catch {
                    parsedValue = parsedValue.split(',').map(v => v.trim()).filter(v => v !== '');
                }
            } else if (parsedValue !== undefined && parsedValue !== null) {
                parsedValue = [String(parsedValue)];
            } else {
                parsedValue = [];
            }
        } else {
            parsedValue = parseValue(value);
        }
    
    // Usa dot notation: server.channels.staff, server.preferences.action_timing, etc
    updates[`server.${key}`] = parsedValue;
  }
  
  return updates;
}

/**
 * @param {import("next").NextApiRequest} req
 * @param {import("next").NextApiResponse<ResponseData>} res 
 */
export async function POST(req, res) {
    try {
        const body = await req.json();
        
        console.log('📦 Body recebido:', body);

        if (!body.guildId) {
            return new Response(JSON.stringify({ error: 'guildId é obrigatório' }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            })
        }

        if (!body.data) {
            return new Response(JSON.stringify({ error: 'config é obrigatório' }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            })
        }

        await client.connect();

        const collection = client.db('Salazar').collection('configuration');

        // Constrói o objeto de update com dot notation
        const updateFields = buildUpdateQuery(body.data);
        
        console.log('🔧 Update query:', updateFields);

        // Atualiza usando $set com dot notation (igual ao bot)
        const result = await collection.findOneAndUpdate(
            { server_id: body.guildId },
            { 
                $set: updateFields
            },
            { 
                returnDocument: "after", 
                upsert: true 
            }
        );

        console.log('✅ Documento atualizado');

        return new Response(JSON.stringify({ 
            message: 'Configurações salvas com sucesso!', 
            updated: Object.keys(updateFields).length
        }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        })
    } catch (error) {
        console.error('❌ Erro:', error);
        
        return new Response(JSON.stringify({ 
            error: error.message || 'Erro desconhecido' 
        }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        })
    } finally {
        await client.close();
    }
}

/**
 * @param {import("next").NextApiRequest} req
 * @param {import("next").NextApiResponse<ResponseData>} res 
 */
export async function GET(req, res) {
    return new Response('Método incorreto.', {
        status: 405,
        headers: { "Content-Type": "application/json" },
    })
}