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
  // Se for string numérica, converte para número
  if (typeof value === 'string' && !isNaN(value) && value !== '') {
    return Number(value);
  }
  // Se for array, processa cada item
  if (Array.isArray(value)) {
    return value.map(parseValue);
  }
  return value;
}

/**
 * Constrói o objeto de update usando dot notation
 */
function buildUpdateQuery(config) {
  const updates = {};
  
  for (const [key, value] of Object.entries(config)) {
    const parsedValue = parseValue(value);
    
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