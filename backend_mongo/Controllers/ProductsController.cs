using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IMongoCollection<Product> _products;

    public ProductsController(IConfiguration config)
    {
        var client = new MongoClient(config.GetConnectionString("MongoDb"));
        var database = client.GetDatabase("ProductDb");
        _products = database.GetCollection<Product>("Products");
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var products = await _products.Find(_ => true).ToListAsync();
        return Ok(products);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var product = await _products.Find(p => p.Id == id).FirstOrDefaultAsync();
        if (product == null)
            return NotFound();

        return Ok(product);
    }

    [HttpPost]
    public async Task<IActionResult> Create(Product product)
    {
        await _products.InsertOneAsync(product);
        return CreatedAtAction(nameof(GetById), new { id = product.Id }, product);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, Product updatedProduct)
    {
        var result = await _products.ReplaceOneAsync(p => p.Id == id, updatedProduct);

        if (result.MatchedCount == 0)
            return NotFound();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var result = await _products.DeleteOneAsync(p => p.Id == id);

        if (result.DeletedCount == 0)
            return NotFound();

        return NoContent();
    }
}
