<script lang="typescript">    
    let searchTerm: string;

    const checkList = new Array(20000);
    const names = new Array(20000);

    const handleChange = (i: number) => (e) => {
        checkList[i] = e.target.checked;
    }

    const handleChangeName = (i: number) => (e) => {
        names[i] = e.target.value;        
    }

    
</script>

<style>
    div {
        padding: 8px;
        border-bottom: 1px solid #999;
        font-size: 20px;
    }

</style>

{#each checkList as item, i}
    <div>
        <input type="checkbox" checked="{item}" on:change="{handleChange(i)}" /> Item {i}
        <input type="text" value={names[i] ?? ''} on:keyup="{handleChangeName(i)}" />
    </div>
{/each}